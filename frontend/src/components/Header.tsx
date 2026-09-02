import { Link, useLocation } from "react-router-dom";

function Header() {
    const location = useLocation();

    const menuItems = [
        { to: '/stock', label: '재고' },
        { to: '/companies', label: '거래처' },
        { to: '/quotations', label: '견적' },
        { to: '/orders', label: '오더' },
        { to: '/shipments', label: '배송' },
        { to: '/packing-lists', label: '패킹리스트' },
        { to: '/payments', label: '결제' },
    ];

    return (
        <header className="bg-blue-900 w-40 min-h-screen flex flex-col p-3">
            <Link to="/" className="text-white text-base font-bold mb-10 px-3 pt-2">
                Trade Export
            </Link>
            <nav className="flex flex-col gap-1">
                {menuItems.map((item) => (
                    <Link
                        key={item.to}
                        to={item.to}
                        className={`px-2 py-2 rounded-md text-sm ${location.pathname === item.to
                            ? 'bg-white/15 text-white font-medium'
                            : 'text-white/70 hover:text-white'
                            }`}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>
        </header>
    )
}

export default Header;