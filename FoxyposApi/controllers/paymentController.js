require("dotenv").config();

const omise = require("omise")({
    secretKey: process.env.OMISE_SECRET_KEY
});


exports.createPromptPayQR = async (req, res) => {
    try {
        const { amount } = req.body;
        const numericAmount = Number(amount);

        if (!Number.isFinite(numericAmount) || numericAmount < 20 || numericAmount > 150000) {
            return res.status(400).json({
                success: false,
                message: "ยอดชำระต้องอยู่ระหว่าง 20 ถึง 150,000 บาท"
            });
        }

        if (!process.env.OMISE_SECRET_KEY) {
            return res.status(500).json({
                success: false,
                message: "ยังไม่ได้ตั้งค่า OMISE_SECRET_KEY ใน backend"
            });
        }

        console.log("Payment amount:", amount);
        const charge = await omise.charges.create({
            amount: Math.round(numericAmount * 100),
            currency: "THB",
            source: {
                type: "promptpay"
            }
        });

        console.log("Charge created:", charge.id);
        res.json({
            success: true,
            qr: charge.source.scannable_code.image.download_uri,
            charge_id: charge.id
        });
    } catch (error) {
        console.error("Omise Error:", error);
        res.status(500).json({
            success: false,
            message: error?.message || error?.description || "ไม่สามารถสร้าง QR PromptPay ได้",
            code: error?.code || error?.type || "payment_error"
        });

    }
};
