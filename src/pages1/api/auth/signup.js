import { hashPassword } from '../../../lib/auth';
import connectMongo from '../../../../database/conn';
import Users from '../../../../model/Schema';
import { convertAddress } from '@/lib/addressConvert';

export default async function handler(req, res) {

    connectMongo().catch(() => {
        return res.status(500).json({
            error: {
                message: `DB 연결에 실패했습니다`
            }
        })}
    );

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
            const convertedAddress = await convertAddress(address);
            const addressObj = {
                fullAddress: address,
                x: convertedAddress.x,
                y: convertedAddress.y,
            }
            
            await Users.create({ email, password: hashedPassword, address: addressObj })
                .then(() => {
                    return res.status(201).json({
                        success: 'ok',
                        message: '성공적으로 생성했습니다'
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
            });
        }

    }
    else {
        res.setHeader('Allow', ['POST']);
        res.status(500).json({
            error: {
                message: "POST 메서드만 유효합니다"
            }
        });
    }
}