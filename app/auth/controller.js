const { buildPoseidon } = require('circomlibjs');
const snarkjs = require('snarkjs');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { hash } = require('crypto');

const vKey = JSON.parse(fs.readFileSync(path.join(__dirname, "../../zk/verification-key.json")))

let addresses = {}

module.exports = {
    register: async(req, res) => {
        try {
            const { address } = req.body

            if(!address) {
                return res.status(400).json({ message: 'Address is required' })
            }
            
            const poseidon = await buildPoseidon();
            const hashValue = poseidon([BigInt(address)]);
            const hash = poseidon.F.toString(hashValue);

            if(addresses[hash]) {
                return res.status(400).json({ message: 'Address is already registered' })
            }
            addresses[hash] = hash

            res.status(200).json({ message: "Success", data: hash })
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },
    login : async(req, res) => {
        try {
            const { proof, publicSignals } = req.body

            if(!proof || !publicSignals) {
                return res.status(400).json({ message: 'you must generate a proof first' })
            }

            const checkAddress = addresses[publicSignals[0]]
            if(!checkAddress) {
                return res.status(400).json({ message: 'Address is not registered' })
            } else {
                const verified = await snarkjs.groth16.verify(
                    vKey,
                    publicSignals,
                    proof
                )
                if(verified) {
                    const token = jwt.sign({
                        hash: publicSignals[0]
                    }, "test") // secret key

                    res.status(201).json({ message: 'Login successful', data: token })
                } else {
                    res.status(400).json({ message: 'Invalid proof' })
                }
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}