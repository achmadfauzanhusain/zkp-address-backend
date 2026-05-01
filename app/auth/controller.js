const { buildPoseidon } = require('circomlibjs');
const path = require('path');
const fs = require('fs');

const vKey = JSON.parse(fs.readFileSync(path.join(__dirname, "../../zk/verification-key.json")))

let addresses = ["1246254232611659900859275708950704372506712141612608580836537858378470542983"]

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

            res.status(200).json({ message: "Success", data: hash })
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },
    login : async(req, res) => {
        try {
            const { proof, publicSignals } = req.body

            // const checkAddress = addresses[address]
            // console.log(checkAddress)

            const checkAddress = addresses[publicSignals[0]]
            console.log(checkAddress)

            // if(address.includes(address)) {
            //     // Address is registered
            //     const poseidon = await buildPoseidon();
            //     const hashValue = poseidon([BigInt(address)]);
            //     const hash = poseidon.F.toString(hashValue);

            //     // Verify the proof using the verification key
            //     const isValidProof = await snarkjs.groth16.verify(vKey, publicSignals, proof);

            //     if (isValidProof) {
            //         res.status(200).json({ message: 'Login successful' });
            //     } else {
            //         res.status(400).json({ message: 'Invalid proof' });
            //     }
            // } else {
            //     return res.status(400).json({ message: 'Address is not registered' });
            // }
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}