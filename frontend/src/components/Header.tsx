import { Link } from "react-router-dom";

function Header() {
    return (
        <header>
            <nav>
                <Link to="/stock">재고</Link>
                <Link to="/companies">거래처</Link>
                <Link to="/quotations">견적</Link>
                <Link to="/orders">오더</Link>
                <Link to="/shipments">배송</Link>
                <Link to="/packing-lists">패킹리스트</Link>
                <Link to="/payments">결제</Link>
            </nav>
        </header>
    )
}

export default Header;