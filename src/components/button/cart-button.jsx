import Modal from "../modal";
import { useState } from 'react';



const CartButton = () => {

const [isOpen ,setIsOpen] =useState(false);


  return (
    <div className="sticky top-4 left-1 z-[999] mt-10 -mb-10 w-fit">
      <button className="list-btn" onClick={()=>setIsOpen(true)}>
        Sepet
        <img src="/cart.png" alt="cart" className="w-12 absolute right-1 bottom-0" />
      </button>
      <Modal isOpen={isOpen} close={()=>setIsOpen(false)}/>
    </div>
  );
};

export default CartButton;