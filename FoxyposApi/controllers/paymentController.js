const omise = require("omise")({
    secretKey: process.env.OMISE_SECRET_KEY
});


exports.createPromptPayQR = async (req, res) => {
    try {
        const { amount } = req.body;
        console.log("Payment amount:", amount);
        const charge = await omise.charges.create({
            amount: Math.round(Number(amount) * 100),
            currency: "thb",
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
            success:false,
            message:error.message
        });

    }
};