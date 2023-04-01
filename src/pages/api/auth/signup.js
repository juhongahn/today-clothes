import { hashPassword } from '../../../lib/auth';
import connectMongo from '../../../../database/conn';
import Users from '../../../../model/Schema';
import { convertAddress } from '@/lib/addressConvert';

export default async function handler(req, res) {

    connectMongo().catch(() => res.status(500).json({
        error: {
            message: `DB 연결에 실패했습니다`
        }
    }));

    if (req.method === 'POST') {
        const data = req.body;
        if (!data) return res.status(404).json({
            error: {
                message: "폼을 완성해 주세요"
            }
        });
        const { email, password, address, passwordConfirmation } = data;
        
        /* 유효성 검사 */
        if (
            !email ||
            !email.includes('@') ||
            !password ||
            password !== passwordConfirmation ||
            password.trim().length < 7 ||
            !address
        ) {
            return res.status(422).json({
                error: {
                    message: '유효하지 않은 폼 데이터 입니다'
                }
            });
        }

        /* 이미 존재하는 계정인지 검사 */
        const checkExisting = await Users.findOne({ email })
        if (checkExisting) {
            return res.status(422).json({
                error: {
                    message: '이미 존재하는 이메일 입니다'
                }
            });
        }
        const hashedPassword = await hashPassword(password);

        try {
            const res = await convertAddress(address);
            const addressObj = {
                fullAddress: address,
                x: res.x,
                y: res.y,
            }

            Users.create({ email, password: hashedPassword, addressObj })
                .then(() => {
                    return res.status(201).json({
                        success: 'ok',
                        message: 'Success creating User'
                    })
                })
                .catch(() => {
                    return res.status(422).json({
                        error: {
                            message: '회원가입에 실패했습니다'
                        }
                    });
                });
        } catch (err) {
            return res.status(500).json({
                error: {
                    message: `회원가입을 진행하는데 에러가 발생했습니다`
                }
            })
        }

    }
    else {
        res.status(500).json({
            error: {
                message: "HTTP method not vaild only POST Accepted"
            }
        })
    }
}