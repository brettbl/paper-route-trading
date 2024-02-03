'use client'

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./page.module.css";
import getInventoryItem from "@/pages/api/getInventoryItem";
import getProduct from "@/pages/api/getProduct";
import Image from "next/image";

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
  const pk = searchParams?.get('u') || searchParams?.get('pk1')?.toLowerCase();
  const n = searchParams?.get('n');
  const e = searchParams?.get('e');
  const [productId, setProductId] = useState(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [response, setResponse] = useState(null);

  // Call getInventoryItem with the pk value
  const fetchInventoryItem = async (pk: string) => {
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

      const response = await fetch(`/api/verifyTap?${params}`);
      const data = await response.json();
      setResponse(data.response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (pk) {
      fetchInventoryItem(pk);
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
        response === 'Pass' ? (
          product && (
            <>
              <img src={`https:${product?.Image}`} alt="Product Image"/>
              <span className={styles.token}>1 of 1</span>
              <h3>{product?.Name}</h3>
              <span>{product?.Description}</span>
            </>
          )
        ) : response === 'Fail' ? (
          <div className={styles.alert}>
            <div className={styles.fail}>Verification failed</div>
          </div>
        ) : (
          <div className={styles.alert}>
            <div className={styles.loading}>
              <Image src="/loading.gif" alt="Loading" width={100} height={100} />
            </div>
          </div>
        )
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