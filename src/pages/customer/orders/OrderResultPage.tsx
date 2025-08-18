import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { customerApi } from "../api";

export const OrderResultPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const handledRef = useRef(false);

    useEffect(() => {
        if (handledRef.current) return;
        handledRef.current = true;

        const searchParams = new URLSearchParams(location.search);

        
        const momoQuery = {
            orderId: searchParams.get('orderId') || undefined,
            resultCode: searchParams.get('resultCode') || undefined,
            message: searchParams.get('message') || undefined,
            amount: searchParams.get('amount') || undefined,
            payType: searchParams.get('payType') || undefined,
        };

        
        const vnp_TxnRef = searchParams.get('vnp_TxnRef');
        const vnp_ResponseCode = searchParams.get('vnp_TransactionStatus');
        const vnp_Amount = searchParams.get('vnp_Amount');

        
        const formattedAmount = (momoQuery.amount || vnp_Amount)
            ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                Number(momoQuery.amount || vnp_Amount) / (vnp_Amount ? 100 : 1)
            )
            : undefined;

        
        if (momoQuery.orderId && momoQuery.resultCode) {
            customerApi.momoUrlReturn(momoQuery.orderId, momoQuery.resultCode)
                .then(() => {
                    if (momoQuery.resultCode === '0') {
                        customerApi.deleteCart();
                        toast.success(`Payment successful ${formattedAmount ? `(${formattedAmount})` : ''}`);
                    } else {
                        toast.error("Payment failed. Please try again.");
                    }
                    navigate('/');
                })
                .catch(() => {
                    toast.error("Payment verification error.");
                    navigate('/');
                });
        }

        
        else if (vnp_TxnRef && vnp_ResponseCode) {
            customerApi.vnpayReturn(vnp_TxnRef, vnp_ResponseCode)
                .then(() => {
                    if (vnp_ResponseCode === '00') {
                        customerApi.deleteCart();
                        toast.success(`Payment successful ${formattedAmount ? `(${formattedAmount})` : ''}`);
                    } else {
                        toast.error("Payment failed. Please try again.");
                    }
                    navigate('/');
                })
                .catch(() => {
                    toast.error("Payment verification error.");
                    navigate('/');
                });
        }

        else {
            toast.error("Payment failed.");
            navigate('/');
        }
    }, [location.search, navigate]);

    return null;
};
