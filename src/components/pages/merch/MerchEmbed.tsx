'use client';

import Script from 'next/script';
import Text from '@/components/text/Text';
import styles from './merch.module.css';

const MerchEmbed = () => {
  return (
    <>
      <div className="sectionWrapperColumn">
        <Text type="h1">Merch</Text>
        <Text type="bodyLarge">
          Støtt PMDD Norge ved å kjøpe fra vår nettbutikk. Alle inntekter går
          til arbeidet med å spre kunnskap om PMDD i Norge.
        </Text>
      </div>

      <div className="darkBackground">
        <div className={styles.wrapper}>
          <div id="collection-component-1775636529316" />
        </div>
      </div>

      <Script
        id="shopify-buy-button"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function () {
              var scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
              if (window.ShopifyBuy) {
                if (window.ShopifyBuy.UI) {
                  ShopifyBuyInit();
                } else {
                  loadScript();
                }
              } else {
                loadScript();
              }
              function loadScript() {
                var script = document.createElement('script');
                script.async = true;
                script.src = scriptURL;
                (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
                script.onload = ShopifyBuyInit;
              }
              function ShopifyBuyInit() {
                var client = ShopifyBuy.buildClient({
                  domain: 'getmerchno.myshopify.com',
                  storefrontAccessToken: 'a96057dfef9a7640c2e325a6e14df23e',
                });
                ShopifyBuy.UI.onReady(client).then(function (ui) {
                  ui.createComponent('collection', {
                    id: '499373736183',
                    node: document.getElementById('collection-component-1775636529316'),
                    moneyFormat: '%7B%7Bamount_with_comma_separator%7D%7D%20kr',
                    options: {
                      "product": {
                        "styles": {
                          "product": {
                            "@media (min-width: 601px)": {
                              "max-width": "calc(25% - 20px)",
                              "margin-left": "20px",
                              "margin-bottom": "50px",
                              "width": "calc(25% - 20px)"
                            }
                          },
                          "title": { "font-size": "20px", "color": "#000000" },
                          "button": {
                            "font-weight": "bold",
                            ":hover": { "background-color": "#1c6580" },
                            "background-color": "#1c6580",
                            ":focus": { "background-color": "#1c6580" },
                            "border-radius": "10px",
                            "padding-left": "60px",
                            "padding-right": "60px"
                          },
                          "price": { "font-weight": "bold", "font-size": "16px", "color": "#000000" }
                        },
                        "buttonDestination": "cart",
                        "contents": { "options": false },
                        "width": "380px",
                        "text": { "button": "Vis produkt" }
                      },
                      "productSet": {
                        "styles": {
                          "products": {
                            "@media (min-width: 601px)": { "margin-left": "-20px" }
                          }
                        }
                      },
                      "modalProduct": {
                        "contents": {
                          "img": false,
                          "imgWithCarousel": true,
                          "button": false,
                          "buttonWithQuantity": true
                        },
                        "styles": {
                          "button": {
                            "font-weight": "bold",
                            ":hover": { "background-color": "#1c6580" },
                            "background-color": "#1c6580",
                            ":focus": { "background-color": "#1c6580" },
                            "border-radius": "10px",
                            "padding-left": "60px",
                            "padding-right": "60px"
                          },
                          "title": {
                            "font-family": "Helvetica Neue, sans-serif",
                            "font-weight": "bold",
                            "font-size": "28px",
                            "color": "#000000"
                          },
                          "price": {
                            "font-family": "Helvetica Neue, sans-serif",
                            "font-weight": "bold",
                            "font-size": "18px",
                            "color": "#000000"
                          }
                        },
                        "text": { "button": "Legg i handlekurv" }
                      },
                      "cart": {
                        "styles": {
                          "button": {
                            "font-weight": "bold",
                            ":hover": { "background-color": "#1c6580" },
                            "background-color": "#1c6580",
                            ":focus": { "background-color": "#1c6580" },
                            "border-radius": "10px"
                          },
                          "title": { "color": "#000000" },
                          "header": { "color": "#000000" },
                          "subtotalText": { "color": "#000000" },
                          "subtotal": { "color": "#000000" },
                          "empty": { "color": "#000000" }
                        },
                        "text": {
                          "title": "Handlekurv",
                          "total": "Total",
                          "empty": "Din handlekurv er tom",
                          "notice": "Frakt- og rabattkoder legges til i kassen.",
                          "button": "Til betaling"
                        }
                      },
                      "toggle": {
                        "styles": {
                          "toggle": {
                            "font-weight": "bold",
                            "background-color": "#1c6580",
                            ":hover": { "background-color": "#1c6580" },
                            ":focus": { "background-color": "#1c6580" }
                          }
                        }
                      }
                    }
                  });
                });
              }
            })();
          `,
        }}
      />
    </>
  );
};

export default MerchEmbed;
