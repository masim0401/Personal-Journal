import './Header.css';
import SelectUser from '../SelectUser/SelectUser.jsx';
function Header() {
	return (
		<>
			<img className='logo' src='/logo.svg' alt='logo'/>
			<SelectUser/>
		</>
	);
}

export default Header;