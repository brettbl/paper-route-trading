'use client'

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./page.module.css";
import getInventoryItem from "@/pages/api/getInventoryItem";
import getProduct from "@/pages/api/getProduct";
import verifyTap from "@/pages/api/verifyTap";

interface Product {
  Name: string;
  Description: string;
  ProductType: string;
  SKU: string;
  SmartContract: string;
  Image: string;
}

const ProductComponent: React.FC = () => {
  const searchParams = useSearchParams();
  const pk = searchParams?.get('pk1') || searchParams?.get('u');
  const n = searchParams?.get('n');
  const e = searchParams?.get('e');
  const [productId, setProductId] = useState(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [isPass, setIsPass] = useState(false);
  const [response, setResponse] = useState(null);

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

  const fetchVerification = async (u:string, n:string , e:string) => {
    try {
      const params = new URLSearchParams();
      params.append('u', u);
      params.append('n', n);
      params.append('e', e);

      const response = await fetch(`/api/proxy?${params}`);
      const data = await response.json();
      setResponse(data.response);
      if (data.response === "Pass") {
        setIsPass(true);
      }
      console.log(data);
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

  useEffect(() => {
    if (pk && n && e) {
      fetchVerification(pk, n, e);
    }
  }, [pk, n, e]);

  return (
    <main className={styles.main}>
      {
      // isPass ? (
        product && (
          <>
            <img src={`https:${product?.Image}`} alt="Product Image"/>
            <span className={styles.token}>1 of 1</span>
            <h3>{product?.Name}</h3>
            <span>{product?.Description}</span>
            <span>{response}</span>
          </>
        )
      // ) : (
      //   <div className={styles.failAlert}>Verification failed!</div>
      // )
    }
    </main>
  );
};

const Index: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductComponent />
    </Suspense>
  );
};

export default Index;