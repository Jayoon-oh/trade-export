interface FunnelCardProps {
    label: string;
    count: number;
    amount?: number;
}

function FunnelCard({ label, count, amount }: FunnelCardProps) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className="text-lg font-semibold text-gray-800">{count}건</p>
            {amount != null && (
                <p className="text-xs text-gray-500">${amount.toLocaleString()}</p>
            )}
        </div>
    );
}

export default FunnelCard;