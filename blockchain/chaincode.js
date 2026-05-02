'use strict';

const { Contract } = require('fabric-contract-api');

class CertificateContract extends Contract {

    /**
     * Issue a new academic certificate on the blockchain.
     * Called by university User through the Tawtheeq backend.
     *
     * @param {Context} ctx - Transaction context
     * @param {String} certId - Unique certificate ID (e.g. TAWQ-KSU-2026-A3F7KR)
     * @param {String} studentId - Student's personal identifier (personal ID)
     * @param {String} degreeName - Degree title (e.g. "Bachelor of Computer Science")
     * @param {String} major - Major / specialization (e.g. "Software Engineering")
     * @param {String} gpa - Student's GPA (stored as string for ledger compatibility)
     * @param {String} university - University name
     * @param {String} gradYear - Graduation year
     * @param {String} pdfCid - IPFS CID of the certificate PDF
     * @returns {String} JSON string of the created certificate
     */
    async issueCertificate(ctx, certId, studentId, degreeName, major, gpa, university, gradYear, pdfCid) {
        // Prevent duplicate certificate IDs
        const exists = await this._assetExists(ctx, certId);
        if (exists) {
            throw new Error(`Certificate ${certId} already exists on the ledger`);
        }

        const certificate = {
            docType: 'certificate',
            certId,
            studentId,
            degreeName,
            major,
            gpa,
            university,
            gradYear,
            pdfCid,
            status: 'verified',
            issuedAt: new Date().toISOString(),
            issuedBy: ctx.clientIdentity.getID()
        };

        await ctx.stub.putState(certId, Buffer.from(JSON.stringify(certificate)));
        return JSON.stringify(certificate);
    }

    /**
     * Retrieve a certificate from the ledger by its ID.
     *
     * @param {Context} ctx - Transaction context
     * @param {String} certId - Certificate ID to look up
     * @returns {String} JSON string of the certificate
     */
    async getCertificate(ctx, certId) {
        const data = await ctx.stub.getState(certId);
        if (!data || data.length === 0) {
            throw new Error(`Certificate ${certId} not found on the ledger`);
        }
        return data.toString();
    }

    /**
     * Revoke a certificate on the blockchain.
     * Typically called by MOHE admin or authorized university User.
     *
     * @param {Context} ctx - Transaction context
     * @param {String} certId - Certificate ID to revoke
     * @param {String} reason - Reason for revocation
     * @returns {String} JSON string of the updated certificate
     */
    async revokeCertificate(ctx, certId, reason) {
        const certStr = await this.getCertificate(ctx, certId);
        const certificate = JSON.parse(certStr);

        if (certificate.status === 'revoked') {
            throw new Error(`Certificate ${certId} is already revoked`);
        }

        certificate.status = 'revoked';
        certificate.revokedAt = new Date().toISOString();
        certificate.revokeReason = reason || '';
        certificate.revokedBy = ctx.clientIdentity.getID();

        await ctx.stub.putState(certId, Buffer.from(JSON.stringify(certificate)));
        return JSON.stringify(certificate);
    }

    /**
     * Query all certificates stored on the ledger.
     * Uses a CouchDB rich query if available, otherwise a range query.
     *
     * @param {Context} ctx - Transaction context
     * @returns {String} JSON array of all certificates
     */
    async queryAllCertificates(ctx) {
        const iterator = await ctx.stub.getStateByRange('', '');
        const results = [];
        let res = await iterator.next();
        while (!res.done) {
            if (res.value && res.value.value.toString()) {
                try {
                    const record = JSON.parse(res.value.value.toString('utf8'));
                    if (record.docType === 'certificate') {
                        results.push({ key: res.value.key, record });
                    }
                } catch (err) {
                    console.error(`Error parsing state for key ${res.value.key}: ${err}`);
                }
            }
            res = await iterator.next();
        }
        await iterator.close();
        return JSON.stringify(results);
    }
    /**
     * Query certificates by student personal ID.
     * Requires CouchDB as the state database in Fabric.
     *
     * @param {Context} ctx - Transaction context
     * @param {String} studentPersonalId - Student's personal identifier
     * @returns {String} JSON array of matching certificates
     */
    async queryByStudent(ctx, studentPersonalId) {
        const queryString = JSON.stringify({
            selector: {
                docType: 'certificate',
                studentPersonalId: studentPersonalId
            }
        });

        const iterator = await ctx.stub.getQueryResult(queryString);
        const results = [];
        let res = await iterator.next();
        while (!res.done) {
            if (res.value && res.value.value.toString()) {
                try {
                    const record = JSON.parse(res.value.value.toString('utf8'));
                    results.push({ key: res.value.key, record });
                } catch (err) {
                    console.error(`Error parsing query result: ${err}`);
                }
            }
            res = await iterator.next();
        }
        await iterator.close();
        return JSON.stringify(results);
    }

    /**
     * Get the full transaction history for a certificate.
     * For audit trails - shows every state change (issuance, revocation, etc.)
     *
     * @param {Context} ctx - Transaction context
     * @param {String} certId - Certificate ID
     * @returns {String} JSON array of historical entries
     */
    async getCertificateHistory(ctx, certId) {
        const exists = await this._assetExists(ctx, certId);
        if (!exists) {
            throw new Error(`Certificate ${certId} does not exist`);
        }

        const iterator = await ctx.stub.getHistoryForKey(certId);
        const history = [];
        let res = await iterator.next();
        while (!res.done) {
            if (res.value) {
                const entry = {
                    txId: res.value.txId,
                    timestamp: res.value.timestamp,
                    isDelete: res.value.isDelete
                };
                try {
                    entry.value = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    entry.value = res.value.value.toString('utf8');
                }
                history.push(entry);
            }
            res = await iterator.next();
        }
        await iterator.close();
        return JSON.stringify(history);
    }

    /**
     * Check if an asset exists on the ledger.
     * @private
     */
    async _assetExists(ctx, id) {
        const data = await ctx.stub.getState(id);
        return data && data.length > 0;
    }
}

module.exports = CertificateContract;
