'use client'

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import styles from "./page.module.css";
import getInventoryItem from "@/pages/api/getInventoryItem";
import getProduct from "@/pages/api/getProduct";
import { useEffect, useState } from "react";

interface Product {
  Name: string;
  Description: string;
  ProductType: string;
  SKU: string;
  SmartContract: string;
  Image: string;
}

export default function Home() {
  const searchParams = useSearchParams();
  const pk = searchParams?.get('pk1') 
  const [productId, setProductId] = useState(null);
  const [product, setProduct] = useState<Product | null>(null);

  // Call getInventoryItem with the pk value
  const fetchInventoryItem = async () => {
    try {
      const data = await getInventoryItem(pk as string);
      const uid = (data as any).response.results[0].Product;
      setProductId(uid);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProduct = async () => {
    try {
      const data = await getProduct(productId as any);
      const result = (data as any).response;
      setProduct(result)
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (pk) {
      fetchInventoryItem();
    }
  }, [pk]);

  useEffect(() => {
    if (productId) {
      fetchProduct()
    }
  }, [productId]);

  return (
    <main className={styles.main}>
        <Image src={`https:${product?.Image}`} alt="Product Image" />
        <span className={styles.token}>1 of 1</span>
        <h3>{product?.Name}</h3>
        <span>{product?.Description}</span>
    </main>
  );
};
