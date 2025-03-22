import { useState, useEffect, useRef } from "react";
import { FaChevronDown } from 'react-icons/fa';
import OpenModalMenuItem from "../../Navigation/OpenModalMenuItem";
import NewTransactionFormModal from "../../NewTransFormModal";
import NewGoalFormModal from "../../GoalFormModal/GoalFormModal";
import './CreateButton.css';

function CreateButton() {
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();

    const toggleMenu = (e) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    };

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (ulRef.current && !ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener("click", closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const closeMenu = () => setShowMenu(false);

    return (
        <>
            <button className='create-button' onClick={toggleMenu}>Create <FaChevronDown className='FaChevronDown'/></button>
            {showMenu && (
                <ul className={"create-dropdown"} ref={ulRef}>
                    {
                        <>
                            <OpenModalMenuItem
                                className='create-modal-item'
                                itemText="New Transaction"
                                onItemClick={closeMenu}
                                modalComponent={<NewTransactionFormModal transaction={null}/>}
                            />
                            <OpenModalMenuItem
                                className='create-modal-item'
                                itemText="New Goal"
                                onItemClick={closeMenu}
                                modalComponent={<NewGoalFormModal />}
                            />
                        </>}
                </ul>
            )}
        </>
    );
}

export default CreateButton;
