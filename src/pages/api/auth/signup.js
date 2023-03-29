import { hashPassword } from '../../../lib/auth';
import connectMongo from '../../../../database/conn';
import Users from '../../../../model/Schema';

export default async function handler(req, res) {

    connectMongo().catch(error => res.json({ error: `Connection Failed...! ${error}` }))

    if (req.method === 'POST') {
        const data = req.body;
        //if (!data) return res.status(404).json({ error: "Don't have form data...!" });
        const { email, password, address } = data;

        /* 유효성 검사 */
        if (
            !email ||
            !email.includes('@') ||
            !password ||
            password.trim().length < 7 ||
            !address
        ) {
            return res.status(422).json({
                message:
                    'password should also be at least 7 characters long.',
                error: true,
            });
        }

        /* 이미 존재하는 계정인지 검사 */
        const checkExisting = await Users.findOne({ email })
        if (checkExisting) {
            return res.status(422).json({ message: 'User Email already exists!', error: true });
        }
        const hashedPassword = await hashPassword(password);

        Users.create({ email, password: hashedPassword, address })
            .then(data => {
                return res.status(201).json({ status: true, user: data })
            })
            .catch((err) => {
                return res.status(422).json({ err: 'Error occured Createing with: ' + err });
            });
    }
    else {
        res.status(500).json({ message: "HTTP method not vaild only POST Accepted" })
    }
}