import {
  collection,
  deleteDoc,
  getDocs,
  doc,
  setDoc,
  query,
  where,
  limit,
  addDoc,
  updateDoc,
  getDoc,
} from 'firebase/firestore';
  import { db } from '../config';
  
  
  const colRef = collection(db , 'carts');
  
  const getCart = async (uid) => {
    const q = query(colRef , where('uid' , '==' , uid) , limit(1));
    const promise = await getDocs(q);
    return promise.docs[0];
  }
  
  const createCart = async (uid) => {
    const cartRef = doc(collection(db , 'carts'));
    await setDoc(cartRef , { uid });
    return cartRef;  
  }
  
  const deleteCart = async (id) => {
    const cart = doc(db , 'carts' , id);
    await deleteDoc(cart);
  }

  const addToCart = async (food, uid, counter) => {
    let cart = await getCart(uid);
    if (!cart) {
      const ref = await createCart(uid);
      cart = { id: ref.id };
    }
    const cartItemsColRef = collection(db, 'carts', cart.id, 'items');
  
    // Check if item is already in cart
    const q = query(cartItemsColRef, where('foodId', '==', food.foodId), limit(1));
    const existing = await getDocs(q);
    if (!existing.empty) {
      const docSnap = existing.docs[0];
      const currentQty = docSnap.data().quantity || 0;
      await updateDoc(doc(db, 'carts', cart.id, 'items', docSnap.id), {
        quantity: currentQty + counter,
      });
      return docSnap.id;
    }
  
    const item = {
      ...food,
      quantity: counter,
    };
    const itemRef = await addDoc(cartItemsColRef, item);
    console.log('added to cart! this id = ', itemRef.id);
    return itemRef.id;
  };
  
  const inCart = async (uid, foodId) => {
    const cartItemsColRef = collection(db , 'carts' , uid , 'items');
    const q = query(cartItemsColRef , where('foodId' , '==' , foodId) , limit(1));
    const promise = await getDocs(q);
    return promise;
  };
  const removeFromCart = async (uid , itemId ) => {
    let cart = await getCart(uid);
    if (!cart) {
      console.log('cart not found');
      return false;
    }
    const cartItem = doc(db , 'carts', cart.id , 'items' , itemId);
    await deleteDoc(cartItem);  
    console.log('cart item deleted!');
  }
  
  const getCartItems = async (uid) => {
    let cart = await getCart(uid);
    if (!cart) {
      cart = await createCart(uid);
      return [];
    }
    const itemsRef = collection(db , 'carts' , cart.id , 'items');
    const promise = await getDocs(itemsRef);
    const items = [];
    promise.docs.forEach((item) => {
      console.log('item fetched' , item.data());
      items.push({ ...item.data() , itemId: item.id });
    });
    console.log('cart items fetched' , items);
    return items;
  }
  
const increaseQuantity = async (uid, itemId) => {
  const cart = await getCart(uid);
  if (!cart) throw new Error('Cart not found');

  const itemRef = doc(db, 'carts', cart.id, 'items', itemId);
  const itemSnap = await getDoc(itemRef);
  if (!itemSnap.exists()) throw new Error('Item not found');

  const quantity = itemSnap.data().quantity || 0;
  await updateDoc(itemRef, { quantity: quantity + 1 });
};

const decreaseQuantity = async (uid, itemId) => {
  const cart = await getCart(uid);
  if (!cart) throw new Error('Cart not found');

  const itemRef = doc(db, 'carts', cart.id, 'items', itemId);
  const itemSnap = await getDoc(itemRef);
  if (!itemSnap.exists()) throw new Error('Item not found');

  const quantity = itemSnap.data().quantity || 0;

  if (quantity <= 1) {
    await deleteDoc(itemRef); // remove item if quantity becomes 0 or less
    console.log('Item removed from cart');
  } else {
    await updateDoc(itemRef, { quantity: quantity - 1 });
  }
};
export {
  getCart,
  createCart,
  deleteCart,
  addToCart,
  removeFromCart,
  getCartItems,
  inCart,
  increaseQuantity,
  decreaseQuantity,
};
  