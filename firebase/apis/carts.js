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

const addToCart = async (uid, product) => {
  try {
    const cartRef = await getCart(uid); // Get the user's cart
    if (!cartRef) {
      const newCartRef = await createCart(uid); // Create a new cart if it doesn't exist
      cartRef = { id: newCartRef.id };
    }

    const cartItemsRef = collection(db, 'carts', cartRef.id, 'items');
    const q = query(cartItemsRef, where('id', '==', product.id), limit(1));
    const existingItem = await getDocs(q);

    if (!existingItem.empty) {
      const itemDoc = existingItem.docs[0];
      const currentQuantity = itemDoc.data().quantity || 0;
      await updateDoc(doc(db, 'carts', cartRef.id, 'items', itemDoc.id), {
        quantity: currentQuantity + 1,
      });
    } else {
      await addDoc(cartItemsRef, {
        ...product,
        quantity: 1,
      });
    }

    console.log('Product added to cart successfully');
  } catch (error) {
    console.error('Error adding product to cart:', error);
  }
};

  const inCart = async (uid, foodId) => {
    const cartItemsColRef = collection(db , 'carts' , uid , 'items');
    const q = query(cartItemsColRef , where('foodId' , '==' , foodId) , limit(1));
    const promise = await getDocs(q);
    return promise;
  };

const removeFromCart = async (uid, productId) => {
  try {
    const cart = await getCart(uid);
    if (!cart) throw new Error('Cart not found');

    const cartItemsRef = collection(db, 'carts', cart.id, 'items');
    const q = query(cartItemsRef, where('id', '==', productId));
    const snapshot = await getDocs(q);
    console.log('snapshot', snapshot);
    if (!snapshot.empty) {
      const itemDoc = snapshot.docs[0];
      await deleteDoc(doc(db, 'carts', cart.id, 'items', itemDoc.id));
      console.log('Product removed from cart:', productId);
    } else {
      console.log('Product not found in cart:', productId);
    }
  } catch (error) {
    console.error('Error removing product from cart:', error);
  }
};

const removeItemById = async (uid, itemId) => {
  try {
    const cart = await getCart(uid);
    if (!cart) throw new Error('Cart not found');

    const itemRef = doc(db, 'carts', cart.id, 'items', itemId);
    await deleteDoc(itemRef);
    console.log('Item removed from cart by ID:', itemId);
  } catch (error) {
    console.error('Error removing item by ID:', error);
  }
};
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
  removeItemById,
  getCartItems,
  inCart,
  increaseQuantity,
  decreaseQuantity,
};
