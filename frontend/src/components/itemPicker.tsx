import EntitySelect from "./EntitySelect";

interface ItemPickerProps {
    itemsId: number;
    quantity: number;
    itemsList: { id: number; label: string }[];
    onChangeItem: (id: number) => void;
    onChangeQuantity: (qty: number) => void;
}

function ItemPicker({ itemsId, quantity, itemsList, onChangeItem, onChangeQuantity }: ItemPickerProps) {
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
        </>
    );
}

export default ItemPicker;