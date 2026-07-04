import catLaptops from "@/assets/cat-laptops.jpg";
import catPhones from "@/assets/cat-phones.jpg";
import catAudio from "@/assets/cat-audio.jpg";
import catGaming from "@/assets/cat-gaming.jpg";
import catMonitors from "@/assets/cat-monitors.jpg";
import catAccessories from "@/assets/cat-accessories.jpg";
import dealWatch from "@/assets/deal-watch.jpg";
import dealCamera from "@/assets/deal-camera.jpg";
import dealEarbuds from "@/assets/deal-earbuds.jpg";
import dealKeyboard from "@/assets/deal-keyboard.jpg";
import heroLaptop from "@/assets/hero-laptop.png";
import heroPhone from "@/assets/hero-phone.png";
import heroHeadphones from "@/assets/hero-headphones.png";
import saleBBD from "@/assets/sale-bbd.jpg";
import saleBF from "@/assets/sale-blackfriday.jpg";
import saleGIF from "@/assets/sale-gif.jpg";
import salePrime from "@/assets/sale-primeday.jpg";

export const IMG = {
  catLaptops, catPhones, catAudio, catGaming, catMonitors, catAccessories,
  dealWatch, dealCamera, dealEarbuds, dealKeyboard,
  heroLaptop, heroPhone, heroHeadphones,
  saleBBD, saleBF, saleGIF, salePrime,
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  mrp: number;
  lowest: number;
  rating: number;
  img: string;
  verdict: "Buy now" | "Wait" | "Great time";
};

export const PRODUCTS: Product[] = [
  { id: "macbook-air-m3", name: "MacBook Air M3", brand: "Apple", category: "Laptops", price: 94990, mrp: 114900, lowest: 92990, rating: 4.8, img: heroLaptop, verdict: "Buy now" },
  { id: "sony-wh1000xm6", name: "Sony WH-1000XM6", brand: "Sony", category: "Audio", price: 24990, mrp: 36990, lowest: 24990, rating: 4.7, img: heroHeadphones, verdict: "Great time" },
  { id: "pixel-10", name: "Pixel 10", brand: "Google", category: "Smartphones", price: 64999, mrp: 75999, lowest: 61999, rating: 4.6, img: heroPhone, verdict: "Buy now" },
  { id: "iphone-17-pro", name: "iPhone 17 Pro", brand: "Apple", category: "Smartphones", price: 129900, mrp: 134900, lowest: 128900, rating: 4.9, img: heroPhone, verdict: "Wait" },
  { id: "lg-27-oled", name: "LG 27\" OLED", brand: "LG", category: "Monitors", price: 78500, mrp: 108000, lowest: 78500, rating: 4.7, img: catMonitors, verdict: "Great time" },
  { id: "steam-deck-oled", name: "Steam Deck OLED", brand: "Valve", category: "Gaming", price: 54990, mrp: 59990, lowest: 52990, rating: 4.8, img: catGaming, verdict: "Buy now" },
  { id: "keychron-q1", name: "Keychron Q1 HE", brand: "Keychron", category: "Keyboards", price: 18990, mrp: 22990, lowest: 17990, rating: 4.6, img: dealKeyboard, verdict: "Buy now" },
  { id: "apple-watch-ultra-3", name: "Apple Watch Ultra 3", brand: "Apple", category: "Smartwatches", price: 79900, mrp: 89900, lowest: 76900, rating: 4.8, img: dealWatch, verdict: "Wait" },
  { id: "fuji-x100vi", name: "Fujifilm X100VI", brand: "Fujifilm", category: "Cameras", price: 145900, mrp: 152900, lowest: 145900, rating: 4.9, img: dealCamera, verdict: "Buy now" },
  { id: "airpods-pro-3", name: "AirPods Pro 3", brand: "Apple", category: "Audio", price: 22990, mrp: 26900, lowest: 21990, rating: 4.7, img: dealEarbuds, verdict: "Great time" },
];

export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
