import EntitySelect from "./EntitySelect";

interface ItemPickerItem {
    id: number;
    label: string;
    price: number;
}

interface ItemPickerProps {
    itemsId: number;
    quantity: number;
    itemsList: ItemPickerItem[];
    onChangeItem: (id: number) => void;
    onChangeQuantity: (qty: number) => void;
}

function ItemPicker({ itemsId, quantity, itemsList, onChangeItem, onChangeQuantity }: ItemPickerProps) {
    const selectedItem = itemsList.find(item => item.id === itemsId);
    return (
        <>
            <EntitySelect
                value={itemsId}
                onChange={onChangeItem}
                options={itemsList}
                placeholder="품목 선택"
            />
            <input
                type="number"
                value={quantity || ''}
                onChange={(e) => onChangeQuantity(Number(e.target.value))}
                placeholder="수량"
            />
            {selectedItem && (
                <span className="text-sm text-gray-600 self-center">
                    단가: {selectedItem.price.toLocaleString()}원
                    {quantity > 0 && ` / 합계: ${(selectedItem.price * quantity).toLocaleString()}원`}
                </span>
            )}
        </>
    );
}

export default ItemPicker;