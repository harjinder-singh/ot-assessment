import puppeteer from "puppeteer";
import * as cheerio from "cheerio";

async function scrapeProducts() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Navigate to the page and wait for network requests to finish
    await page.goto("https://www.microfocus.com/fr-fr/products?trial=true", {
      waitUntil: "networkidle2",
    });

    // Get the full page content after JavaScript loads
    const content = await page.content();
    const $ = cheerio.load(content);

    // Get all products
    const allProducts = $(".products-grid").find(".letter-block");
    let products = [];
    allProducts.each((index, element) => {
      const startingLetter = $(element).find(".each-letter").text();
      const productList = $(element).children("div").eq(1);
      productList.children("div").each((index, element) => {
        const link = $(element).find(".title a");
        const productName = link.text().trim();
        const description = $(element).find(".description p").text().trim();
        const demoLink = $(element)
          .find(".cta-section .cta-buttons a")
          ?.attr("href");

        products.push({
          productName,
          startingLetter,
          description,
          demoLink: demoLink.startsWith("https")
            ? demoLink
            : demoLink.startsWith("/fr-fr/")
            ? `https://www.microfocus.com${demoLink}`
            : "No Trial/Demo link provided!",
          supportUrl: "https://portal.microfocus.com/s/?language=en_US",
          communityUrl: "https://forums.opentext.com/forums/",
        });
      });
    });

    return products;
  } catch (error) {
    console.log("Something went wrong!");
  } finally {
    await browser.close();
  }
}

const products = await scrapeProducts();
console.log(products?.length > 0 ? products : "No products found!");
