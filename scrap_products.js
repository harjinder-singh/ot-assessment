import axios from "axios";
import * as cheerio from "cheerio";

const url = "https://www.microfocus.com/en-us/products?trial=true";

async function scrapeProducts() {
  try {
    // Fetch the HTML content of the page
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    let products = [];
    const alphabets = "abcdefghijklmnopqrstuvwxyz".split("");

    //Loop to find products based on alphabets
    for (const letter of alphabets) {
      // Get the section with id as alphabet
      const section = $(`#${letter}`);
      // Find all li elements inside div.row > ul.row
      const listItems = section.find(".row .row li");

      for (const element of listItems.toArray()) {
        // Select the <a> inside <h3>
        const link = $(element).find("h3 a");
        // Get the href attribute
        const productUrl = link.attr("href");
        // Get the text content and trim extra spaces
        const productName = link.text().trim();
        // Getting product page html
        const { data } = await axios.get(
          productUrl.startsWith("https")
            ? productUrl
            : `https://www.opentext.com/${productUrl}`
        );
        const product$ = cheerio.load(data);
        // Get overview of product
        const overview =
          product$("#overview").find(".content-box div p").text().trim() ||
          product$("#overview").find(".content-box div").text().trim();
        // Get trial link
        const trialLinkTag = product$("#overview")
          .find(".content-box")
          .next("a");
        const trialLink =
          trialLinkTag?.text() === "Start a free trial today"
            ? trialLinkTag?.attr("href")
            : "No trial link provided!";

        // Pushing compiled data to products array
        products.push({
          product_name: productName,
          starting_letter: letter.toUpperCase(),
          description: overview,
          demo_link: trialLink,
          support_url: "/support",
          community_url: "https://forums.opentext.com/forums/",
        });
      }
    }
    return products;
  } catch (error) {
    console.error("Error scraping data: ", error.message);
    return [];
  }
}

const products = await scrapeProducts();
console.log(products);
