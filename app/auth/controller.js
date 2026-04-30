const { buildPoseidon } = require('circomlibjs');
const path = require('path');
const fs = require('fs');

const vKey = JSON.parse(fs.readFileSync(path.join(__dirname, "../../zk/verification-key.json")))

let address = []

module.exports = {
    register: async(req, res) => {
        try {
            const { address } = req.body

            if(!address) {
                return res.status(400).json({ message: 'Address is required' })
            }

        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },
    login : async(req, res) => {
        try {
            
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}