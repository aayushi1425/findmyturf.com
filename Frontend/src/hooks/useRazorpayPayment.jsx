import api from "../api";
function loadRazorpay() {
    return new Promise((resolve) => {
        if (window.Razorpay) return resolve(true);

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}

export default function useRazorpayPayment() {
    async function payNow({ booking, onSuccess, onError }) {
        const loaded = await loadRazorpay();
        if (!loaded) {
            alert("Razorpay SDK failed to load");
            return;
        }

        try {
            const res = await api.post(
                `/payment/razorpay/create/${booking.id}/`
            );

            const data = res.data;
            const options = {
                key: data.key,
                amount: data.amount,
                currency: data.currency,
                name: booking.turf_name,
                description: "Turf Booking Payment",
                order_id: data.order.id,

                handler: async function (response) {
                    // 3️⃣ Verify payment
                    await api.post(`/payment/razorpay/verify/`, {
                        booking_id: booking.id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                    });

                    onSuccess && onSuccess();
                },

                prefill: data.prefill,
                theme: { color: "#0f172a" },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error(err);
            onError && onError(err);
        }
    }

    return { payNow };
}