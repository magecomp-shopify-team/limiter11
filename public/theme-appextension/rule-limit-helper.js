window.oldQty = 0;
const MC_RULE_LIMIT = {
    mcJq: undefined,
    config: {
        cartPage: {},
        shop: null,
        cartUrl: "/cart.js",
        currVariantLimitRules: {},
        currProduct: null,
        currProductLimitRule: {},
        currCartData: {},
        template: null,
        currQuantitySelector: null,
        checkoutBtn:
            ".cart__checkout-button.button,a[href='checkout'], a[href='/checkout'], button[name='checkout'], input[name='checkout'], #checkout, #CartDrawer-Checkout , .t4s-btn__checkout",
        addtocartBtn:
            ".product-form__submit.button, [name='add'], .add-to-cart, .btn-add-to-cart",
        quantitySelector: [
            ".product-form__quantity .quantity__input",
            "input[name='quantity']",
            ".quantity__input",
            ".product-form__input--quantity",
            "#Quantity",
            ".js-qty__input"
        ],
        minusSelector: [
            "button[name='minus']",
        ],
        plusSelector: [
            "button[name='plus']",
        ],
        cartData: null,
    },
    data: {},
    settings: {},
    popupdesign: {},
    initialize: function () {
        this.config.shop = Shopify?.shop || mcShopName;
        this.config.template = mcTemplate;
        this.prDispatchAddToCart();
        this.loadApp();
    },
    loadApp: async function () {
        this.dispatchCheckoutEvent();

        const current = this;
        document.addEventListener("DOMContentLoaded", function () {
            current.dispatchCheckoutEvent();
        });
        if (this.config.template == "cart") {
            this.checkLimit();
        }
        if (this.config.template == "product") {
            this.config.currProduct = typeof productMasterData != "undefined" ? productMasterData : null;
            this.config.cartData = typeof cartData != "undefined" ? cartData : null;
            this.loadCartData();
            this.getCurrProductLimitData();
        }
    },
    checkLimit: function (isCheckout = false) {
        const data = {
            template: this.config.template,
        };
        const current = this;

        const urlEncodedData = new URLSearchParams(data).toString();

        fetch("/a/rule-limit-proxy", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: urlEncodedData,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.text();
            })
            .then((res) => {
                const jsonString = res.replace(/&quot;/g, '"');
                const jsonData = JSON.parse(jsonString);
                //console.log("json data", jsonData);
                
                const aggregateData = (data) => {
                    const map = new Map();

                    (data || []).forEach((item) => {
                        if (map.has(item.id)) {
                            const existingItem = map.get(item.id);
                            existingItem.quantity += item.quantity;
                        } else {
                            map.set(item.id, { ...item });
                        }
                    });

                    return Array.from(map.values());
                };

                const output = {
                    collectionData: aggregateData(jsonData.collectionData),
                    productData: aggregateData(jsonData.productData),
                    variantData: jsonData.variantData,
                    cartData: jsonData.cart,
                    customerData: jsonData.customerData,
                    rules: jsonData.rules,
                    designcode: jsonData.designcode,
                };
                current.data = output;

                current.popupdesign = output.designcode;
                this.addPopupStyle();
                current.checkRules(isCheckout);

                // console.log("output", output);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    },
    dispatchCheckoutEvent: function () {
        const elements = document.querySelectorAll(this.config.checkoutBtn);
        if (elements.length == 0) {
            console.log("No checkout element found");
        }
        elements.forEach((element) => {
            element.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.checkLimit(true);
            });
        });
        if (this.config.shop == "e9ad32-cd.myshopify.com") {
            const originalButton = document.getElementById('CartDrawer-Checkout');

            if (originalButton) {
                originalButton.style.display = 'none';
                const clonedButton = originalButton.cloneNode(true);
                clonedButton.id = 'CartDrawer-Checkout-Cloned';

                clonedButton.classList.remove('tpo-btn-checkout');

                clonedButton.style.display = 'block';
                originalButton.parentNode.appendChild(clonedButton);

                const removeClassInterval = setInterval(() => {
                    if (clonedButton.classList.contains('tpo-btn-checkout')) {
                        clonedButton.classList.remove('tpo-btn-checkout');
                        console.log('Class tpo-btn-checkout removed from cloned button (via setInterval).');
                    }
                }, 500);

                clonedButton.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    if (typeof MC_RULE_LIMIT !== 'undefined' && typeof MC_RULE_LIMIT.checkLimit === 'function') {
                        MC_RULE_LIMIT.checkLimit(true);
                        console.log('MC_RULE_LIMIT.checkLimit(true) called');
                    } else {
                        console.error('MC_RULE_LIMIT function is not defined.');
                    }
                });

                setTimeout(() => {
                    clearInterval(removeClassInterval);
                }, 30000);
            } else {
                console.error('Original button with ID CartDrawer-Checkout not found in the DOM.');
            }
        }
        if (this.config.shop == "b2b-face2face.myshopify.com") {
            const originalButton = document.querySelector('.t4s-btn__checkout');
            if (originalButton) {
                originalButton.style.display = 'none';
                const clonedButton = originalButton.cloneNode(true);
                clonedButton.id = 'CartDrawer-Checkout-Cloned';
                clonedButton.classList.remove('tpo-btn-checkout');
                clonedButton.style.display = 'block';
                originalButton.parentNode.appendChild(clonedButton);
                const removeClassInterval = setInterval(() => {
                    if (clonedButton.classList.contains('tpo-btn-checkout')) {
                        clonedButton.classList.remove('tpo-btn-checkout');
                        console.log('Class tpo-btn-checkout removed from cloned button (via setInterval).');
                    }
                }, 500);
                clonedButton.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    if (typeof MC_RULE_LIMIT !== 'undefined' && typeof MC_RULE_LIMIT.checkLimit === 'function') {
                        MC_RULE_LIMIT.checkLimit(true);
                        console.log('MC_RULE_LIMIT.checkLimit(true) called');
                    } else {
                        console.error('MC_RULE_LIMIT function is not defined.');
                    }
                });
                setTimeout(() => {
                    clearInterval(removeClassInterval);
                }, 30000);
            } else {
                console.error('Original button with class t4s-btn__checkout not found in the DOM.');
            }
        }
        if (this.config.shop == "ddc5cb.myshopify.com") {
            const originalButton = document.getElementById('update-cart');
            if (originalButton) {
                const clonedButton = originalButton.cloneNode(true);
                clonedButton.setAttribute('data-mc', 'mc-checkout');
                clonedButton.setAttribute('type', 'button');
                clonedButton.setAttribute('name', 'mc-checkout');
                clonedButton.removeAttribute('id');
                originalButton.parentNode.appendChild(clonedButton);
                originalButton.style.display = 'none';
                clonedButton.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    if (typeof MC_RULE_LIMIT !== 'undefined' && typeof MC_RULE_LIMIT.checkLimit === 'function') {
                        MC_RULE_LIMIT.checkLimit(true);
                        console.log('MC_RULE_LIMIT.checkLimit(true) called');
                    } else {
                        console.error('MC_RULE_LIMIT function is not defined.');
                    }
                });
            }
        }
    },
    checkRules: function (isCheckout = false) {
        const rules = this.data.rules;
        const messages = [];
        var msg = this.checkGlobal(rules, messages);
        msg = msg.filter((value, index, array) => array.indexOf(value) === index);

        if (msg.length) {
            this.setMessages(msg);
        } else if (isCheckout) {
            this.proccedToCheckout();
        }
    },
    proccedToCheckout: function () {
        window.location.href = "/checkout";
    },
    addPopupStyle: function () {
        const popupdesign = this.popupdesign ? JSON.parse(this.popupdesign) : {};
        const style = document.createElement("style");
        style.id = "mc-rule-popupstyle";
        style.type = "text/css";
        style.innerHTML = `
                    .mc-rule-popup {
                        display: block; /* Show the popup */
                        position: fixed; /* Stay in place */
                        z-index: ${popupdesign.model_z_index || '1000'}; /* Sit on top */
                        left: 0;
                        top: 0;
                        width: 100%; /* Full width */
                        height: 100%; /* Full height */
                        background-color: rgba(0, 0, 0, 0.5); /* Black background with transparency */
                    }

                    .mc-rule-popup-content {
                        border-radius: ${popupdesign.border_radius + 'px' || ''};
                        background-color: ${popupdesign.model_color || '#fff'};
                        margin: 15% auto; /* 15% from the top and centered */
                        padding: 3px;
                        border: 2px solid ${popupdesign.model_border_color || '#888'};
                        width: 50%; /* Could be more or less, depending on screen size */
                        font-size: ${popupdesign.font_size + 'px' || ''};
                        color: ${popupdesign.model_font_color || 'black'};
                    }

                    .mc-rule-close-btn {
                        color: #383838;
                        float: right;
                        font-size: 28px;
                        font-weight: bold;
                        cursor: pointer;
                        margin-right: 7px;
                    }

                    .mc-rule-close-btn:hover,
                    .mc-rule-close-btn:focus {
                        color: black;
                        text-decoration: none;
                    }`;
        document.head.appendChild(style);
    },
    /**
     *
     * @param {Array} msg
     */
    setMessages: function (msg) {
        let messageHtml = "";
        msg.map((it) => {
            messageHtml += `<li>${it}</li>`;
        });
        if (!document.getElementById("mc-rule-popup")) {
            let popupHTML = `<div id="mc-rule-popup" class="mc-rule-popup">
                            <div class="mc-rule-popup-content">
                                <span class="mc-rule-close-btn" id="closeRuleLimitPopupBtn">&times;</span>
                                <ul class="mc-limit-msg">
                                    ${messageHtml}
                                </ul>
                            </div>
                        </div>`;

            document.body.insertAdjacentHTML("beforeend", popupHTML);
        } else {
            let messageDiv = document.querySelector(".mc-limit-msg");
            messageDiv.innerHTML = messageHtml;
        }
        const popup = document.getElementById("mc-rule-popup");
        const closePopupBtn = document.getElementById("closeRuleLimitPopupBtn");
        this.showAlert();
        if (closePopupBtn && popup) {
            closePopupBtn.addEventListener("click", function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                popup.style.display = "none";
            });
        }
    },
    hideAlert: function () {
        const popup = document.getElementById("mc-rule-popup");
        if (popup) {
            popup.style.display = "none";
        }
    },
    showAlert: function () {
        const popup = document.getElementById("mc-rule-popup");
        if (popup) {
            popup.style.display = "block";
        }
    },
    /**
     * Check all rules & condition for Cart page
     * @param {Array} ruleArray
     * @param {Array} msg
     * @returns {Array}
     */
    checkGlobal: function (ruleArray, msg) {
        (ruleArray || []).map((it) => {
            if (it?.type == "limit") {
                if (it.applyTo === "product") {
                    const messages = this.checkProductLimit(it);
                    msg = [...msg, ...messages];
                } else if (it.applyTo === "sku") {
                    const messages = this.checkVariantLimit(it, msg);
                    msg = [...msg, ...messages];
                } else if (it.applyTo === "cart") {
                    const messages = this.cartLimit(it, msg);
                    msg = [...msg, ...messages];
                } else if (it.applyTo === "group") {
                    const messages = this.checkGroupLimit(it, msg);
                    msg = [...msg, ...messages];
                }
            }

            if (it?.type == "condition") {
                const isCheckFurther = this.isEvaluateConditions(it.condition);
                if (isCheckFurther) {
                    const messages = this.checkGlobal(it.items, msg);
                    msg = [...msg, ...messages];
                }
            }
        });
        return msg;
    },

    /**
     * Check all rule for product variant
     * @param {any} item
     * @returns {Array}
     */
    checkVariantLimit: function (item) {
        const minQuantity = item.min; // Minimum quantity from rules
        const maxQuantity = item.max; // Maximum quantity from rules
        const multipleQuantity = parseInt(item.multiple, 10); // Multiple quantity form rules

        const messages = this.data.variantData
            .map((vItem) => {
                const cartQuantity = vItem.quantity;

                if (cartQuantity < minQuantity) {
                    return item.message;
                } else if (cartQuantity > maxQuantity) {
                    return item.message;
                } else if (multipleQuantity && cartQuantity % multipleQuantity !== 0) {
                    return item.message;
                }
            })
            .filter((msg) => msg != null);

        return messages;
    },

    /**
     * Check all rule for product
     * @param {any} item
     * @returns {Array}
     */
    checkProductLimit: function (item) {
        const minQuantity = item.min; // Minimum quantity from rules
        const maxQuantity = item.max; // Maximum quantity from rules
        const multipleQuantity = parseInt(item.multiple, 10); // Multiple quantity form rules


        const messages = this.data.productData
            .map((pItem) => {
                const cartQuantity = pItem.quantity;

                if (cartQuantity < minQuantity) {
                    return item.message;
                } else if (cartQuantity > maxQuantity) {
                    return item.message;
                } else if (multipleQuantity && cartQuantity % multipleQuantity !== 0) {
                    return item.message;
                }
            })
            .filter((msg) => msg != null);

        return messages;
    },

    /**
     * Check all rule for collection
     * @param {any} item
     * @returns {Array}
     */
    checkCollectionLimit: function (item) {
        const minQuantity = item.min; // Minimum quantity from rules
        const maxQuantity = item.max; // Maximum quantity from rules
        const multipleQuantity = parseInt(item.multiple, 10); // Multiple quantity form rules

        const messages = this.data.collectionData
            .map((cItem) => {
                const cartQuantity = cItem.quantity;

                if (cartQuantity < minQuantity) {
                    return item.message;
                } else if (cartQuantity > maxQuantity) {
                    return item.message;
                } else if (multipleQuantity && cartQuantity % multipleQuantity !== 0) {
                    return item.message;
                }
            })
            .filter((msg) => msg != null);

        return messages;
    },

    /**
     * Check all rule for cart
     * @param {any} item
     * @returns {Array}
     */
    cartLimit: function (item) {
        const minQuantity = parseInt(item.min, 10); // Minimum quantity from rules
        const maxQuantity = parseInt(item.max, 10); // Maximum quantity from rules
        const multipleQuantity = parseInt(item.multiple, 10); // Multiple quantity form rules

        const messages = [];
        const cartData = this.data.cartData;
        const cartQuantity = cartData.item_count;

        if (cartQuantity < minQuantity) {
            return [item.message];
        } else if (cartQuantity > maxQuantity) {
            return [item.message];
        } else if (multipleQuantity && cartQuantity % multipleQuantity !== 0) {
            return [item.message];
        }

        return messages;
    },

    /**
     * Check all types of group limit
     * @param {any} item
     * @param {Array} msg
     * @returns {Array}
     */
    checkGroupLimit: function (item, msg) {
        if (item.group.field === "product") {
            const messages = this.isValidGroupProduct(item, msg);
            msg = [...msg, ...messages];
        } else if (item.group.field === "coll") {
            const messages = this.isValidGroupCollection(item, msg);
            msg = [...msg, ...messages];
        } else if (item.group.field === "product_title") {
            const messages = this.isValidGroupProductTitle(item, msg);
            msg = [...msg, ...messages];
        } else if (item.group.field === "product_type") {
            const messages = this.isValidGroupProductType(item, msg);
            msg = [...msg, ...messages];
        } else if (item.group.field === "ptag") {
            const messages = this.isValidGroupProductTag(item, msg);
            msg = [...msg, ...messages];
        } else if (item.group.field === "handle") {
            const messages = this.isValidGroupProductHandle(item, msg);
            msg = [...msg, ...messages];
        } else if (item.group.field === "vendor") {
            const messages = this.isValidGroupProductVendor(item, msg);
            msg = [...msg, ...messages];
        } else if (item.group.field === "variant_title") {
            const messages = this.isValidGroupProductVariantTitle(item, msg);
            msg = [...msg, ...messages];
        } else if (item.group.field === "sku") {
            const messages = this.isValidGroupProductVariantSku(item, msg);
            msg = [...msg, ...messages];
        } else if (item.group.field === "grams") {
            const messages = this.isValidGroupProductVariantGram(item, msg);
            msg = [...msg, ...messages];
        } else if (item.group.field === "price") {
            const messages = this.isValidGroupProductVariantPrice(item, msg);
            msg = [...msg, ...messages];
        }

        return msg;
    },

    /**
     * Check all product group limit
     * @param {any} item
     * @param {Array} msg
     * @returns {Array}
     */
    isValidGroupProduct: function (item, msg) {
        const filterIds = item.group.filter.map((item) => parseInt(item.id, 10));

        switch (item.group.op) {
            case "e": // equal
                const product = this.data.productData.filter(
                    (it) => it.id == filterIds[0],
                );

                if (product.length > 0) {
                    let cartProduct = product[0];
                    const cartQuantity = cartProduct.quantity;

                    if (cartQuantity < item.min) {
                        return [...msg, item.message];
                    } else if (cartQuantity > item.max) {
                        return [...msg, item.message];
                    } else if (item?.multiple && cartQuantity % item?.multiple !== 0) {
                        return [...msg, item.message];
                    }
                }

                return msg;

            case "ne": // not equal
                const productNotEqual = this.data.productData.filter(
                    (it) => it.id != filterIds[0],
                );

                if (productNotEqual.length > 0) {
                    const messages = productNotEqual
                        .map((it) => {
                            if (!(it.quantity >= item.min && it.quantity <= item.max) || (item?.multiple && it.quantity % item?.multiple !== 0)) {
                                return item.message;
                            }
                        })
                        .filter((it) => it);
                    return [...msg, ...messages];
                }

                return msg;

            case "oo": // is one of
                const isOneOfProduct = this.data.productData.filter((it) =>
                    filterIds.includes(it.id),
                );

                if (isOneOfProduct.length > 0) {
                    const messages = isOneOfProduct
                        .map((it) => {
                            if (!(it.quantity >= item.min && it.quantity <= item.max) || (item?.multiple && it.quantity % item?.multiple !== 0)) {
                                return item.message;
                            }
                        })
                        .filter((it) => it);

                    return [...msg, ...messages];
                }

                return msg;

            case "no": // not one of
                const notOneOfProduct = this.data.productData.filter(
                    (it) => !filterIds.includes(it.id),
                );

                if (notOneOfProduct.length === 0) {
                    const messages = notOneOfProduct
                        .map((it) => {
                            if (!(it.quantity >= item.min && it.quantity <= item.max) || (item?.multiple && it.quantity % item?.multiple !== 0)) {
                                return item.message;
                            }
                            return null;
                        })
                        .filter((it) => it);

                    return [...msg, ...messages];
                }

                return msg;

            default:
                return msg;
        }
    },

    /**
     * Check all collection group limit
     * @param {any} item
     * @param {Array} msg
     * @returns {Array}
     */
    isValidGroupCollection: function (item, msg) {
        const filterIds = item.group.filter.map((item) => parseInt(item.id, 10));

        switch (item.group.op) {
            case "e": // equal
                const collection = this.data.collectionData.filter(
                    (it) => it.id == filterIds[0],
                );

                if (collection.length > 0) {
                    let cartCollection = collection[0];
                    const cartQuantity = cartCollection.quantity;

                    if (cartQuantity < item.min) {
                        return [...msg, item.message];
                    } else if (cartQuantity > item.max) {
                        return [...msg, item.message];
                    } else if (item?.multiple && cartQuantity % item?.multiple !== 0) {
                        return [...msg, item.message];
                    }
                }

                return msg;

            case "ne": // not equal
                const collectionNotEqual = this.data.collectionData.filter(
                    (it) => it.id != filterIds[0],
                );

                if (collectionNotEqual.length > 0) {
                    const messages = collectionNotEqual
                        .map((it) => {
                            if (!(it.quantity >= item.min && it.quantity <= item.max) || (item?.multiple && it.quantity % item?.multiple !== 0)) {
                                return item.message;
                            }
                        })
                        .filter((it) => it);
                    return [...msg, ...messages];
                }

                return msg;

            case "oo": // is one of
                const isOneOfCollection = this.data.collectionData.filter(
                    (it) => filterIds.includes(it.id),
                );

                if (isOneOfCollection.length > 0) {
                    const messages = isOneOfCollection
                        .map((it) => {
                            if (!(it.quantity >= item.min && it.quantity <= item.max) || (item?.multiple && it.quantity % item?.multiple !== 0)) {
                                return item.message;
                            }
                        })
                        .filter((it) => it);

                    return [...msg, ...messages];
                }

                return msg;

            case "no": // not one of
                const notOneOfCollection = this.data.collectionData.filter(
                    (it) => !filterIds.includes(it.id),
                );

                if (notOneOfCollection.length === 0) {
                    const messages = notOneOfCollection
                        .map((it) => {
                            if (!(it.quantity >= item.min && it.quantity <= item.max) || (item?.multiple && it.quantity % item?.multiple !== 0)) {
                                return item.message;
                            }
                            return null;
                        })
                        .filter((it) => it);

                    return [...msg, ...messages];
                }

                return msg;

            default:
                return msg;
        }
    },

    /**
     * Check all product title group limit
     * @param {any} item
     * @param {Array} msg
     * @returns {Array}
     */
    isValidGroupProductTitle: function (item, msg) {
        const { filter } = item.group;

        const filterArray = filter.split(",");

        const messages = this.data.productData
            .map((it) => {
                let isLimitCheck = false;
                switch (item.group.op) {
                    case "c":
                        isLimitCheck = it.title.includes(filter);
                        break;
                    case "nc":
                        isLimitCheck = !it.title.includes(filter);
                        break;
                    case "e":
                        isLimitCheck = it.title === filter;
                        break;
                    case "ne":
                        isLimitCheck = it.title !== filter;
                        break;
                    case "oo":
                        isLimitCheck =
                            Array.isArray(filterArray) && filterArray.includes(it.title);
                        break;
                    case "no":
                        isLimitCheck =
                            Array.isArray(filterArray) && !filterArray.includes(it.title);
                        break;
                    default:
                        isLimitCheck = false;
                        break;
                }
                if (isLimitCheck) {
                    if (!(it.quantity >= item.min && it.quantity <= item.max) || (item?.multiple && it.quantity % item?.multiple !== 0)) {
                        return item.message;
                    }
                }
                return null;
            })
            .filter((it) => it);
        if (messages.length > 0) {
            return [...msg, ...messages];
        }
        return msg;
    },

    /**
     * Check all product type group limit
     * @param {any} item
     * @param {Array} msg
     * @returns {Array}
     */
    isValidGroupProductType: function (item, msg) {
        const { filter } = item.group;

        const filterArray = filter.split(",");

        const messages = this.data.productData
            .map((it) => {
                let isLimitCheck = false;
                switch (item.group.op) {
                    case "c":
                        isLimitCheck = it.type.includes(filter);
                        break;
                    case "nc":
                        isLimitCheck = !it.type.includes(filter);
                        break;
                    case "e":
                        isLimitCheck = it.type === filter;
                        break;
                    case "ne":
                        isLimitCheck = it.type !== filter;
                        break;
                    case "oo":
                        isLimitCheck =
                            Array.isArray(filterArray) && filterArray.includes(it.type);
                        break;
                    case "no":
                        isLimitCheck =
                            Array.isArray(filterArray) && !filterArray.includes(it.type);
                        break;
                    default:
                        isLimitCheck = false;
                        break;
                }
                if (isLimitCheck) {
                    if (!(it.quantity >= item.min && it.quantity <= item.max) || (item?.multiple && it.quantity % item?.multiple !== 0)) {
                        return item.message;
                    }
                }
                return null;
            })
            .filter((it) => it);
        if (messages.length > 0) {
            return [...msg, ...messages];
        }
        return msg;
    },

    /**
     * Check all product tag group limit
     * @param {any} item
     * @param {Array} msg
     * @returns {Array}
     */
    isValidGroupProductTag: function (item, msg) {
        const { filter } = item.group;

        const filterArray = filter.split(",");

        const messages = this.data.productData.map((it) => {
            let isLimitCheck = false;
            switch (item.group.op) {
                case "e":
                    isLimitCheck = it.tags.includes(filter);
                    break;
                case "ne":
                    isLimitCheck = !it.tags.includes(filter);
                    break;
                case "oo":
                    isLimitCheck = filterArray.some((tag) => {
                        return it.tags.includes(tag);
                    });
                    break;
                case "no":
                    isLimitCheck = filterArray.some((tag) => {
                        return it.tags.includes(tag);
                    });
                    isLimitCheck = !isLimitCheck;
                    break;

            }
            if (isLimitCheck) {
                if (!(it.quantity >= item.min && it.quantity <= item.max) || (item?.multiple && it.quantity % item?.multiple !== 0)) {
                    return item.message;
                }
            }
        }).filter((it) => it);
        if (messages.length > 0) {
            return [...msg, ...messages];
        }
        return msg;
    },

    /**
     * Check all product handle group limit
     * @param {any} item
     * @param {Array} msg
     * @returns {Array}
     */
    isValidGroupProductHandle: function (item, msg) {
        const { filter } = item.group;

        const filterArray = filter.split(",");

        const messages = this.data.productData
            .map((it) => {
                let isLimitCheck = false;
                switch (item.group.op) {
                    case "e":
                        isLimitCheck = it.handle === filter;
                        break;
                    case "c":
                        isLimitCheck = it.handle.includes(filter);
                        break;
                    case "nc":
                        isLimitCheck = !it.handle.includes(filter);
                        break;
                    case "ne":
                        isLimitCheck = it.handle !== filter;
                        break;
                    case "oo":
                        isLimitCheck =
                            Array.isArray(filterArray) && filterArray.includes(it.handle);
                        break;
                    case "no":
                        isLimitCheck =
                            Array.isArray(filterArray) &&
                            !filterArray.includes(it.handle);
                        break;
                    default:
                        isLimitCheck = false;
                        break;
                }
                if (isLimitCheck) {
                    if (!(it.quantity >= item.min && it.quantity <= item.max) || (item?.multiple && it.quantity % item?.multiple !== 0)) {
                        return item.message;
                    }
                }
                return null;
            })
            .filter((it) => it);
        if (messages.length > 0) {
            return [...msg, ...messages];
        }
        return msg;
    },

    /**
     * Check all product vendor group limit
     * @param {any} item
     * @param {Array} msg
     * @returns {Array}
     */
    isValidGroupProductVendor: function (item, msg) {
        const { filter } = item.group;

        const filterArray = filter.split(",");

        const messages = this.data.productData
            .map((it) => {
                let isLimitCheck = false;
                switch (item.group.op) {
                    case "e":
                        isLimitCheck = it.vendor === filter;
                        break;
                    case "c":
                        isLimitCheck = it.vendor.includes(filter);
                        break;
                    case "nc":
                        isLimitCheck = !it.vendor.includes(filter);
                        break;
                    case "ne":
                        isLimitCheck = it.vendor !== filter;
                        break;
                    case "oo":
                        isLimitCheck =
                            Array.isArray(filterArray) && filterArray.includes(it.vendor);
                        break;
                    case "no":
                        isLimitCheck =
                            Array.isArray(filterArray) &&
                            !filterArray.includes(it.vendor);
                        break;
                    default:
                        isLimitCheck = false;
                        break;
                }
                if (isLimitCheck) {
                    if (!(it.quantity >= item.min && it.quantity <= item.max) || (item?.multiple && it.quantity % item?.multiple !== 0)) {
                        return item.message;
                    }
                }
                return null;
            })
            .filter((it) => it);
        if (messages.length > 0) {
            return [...msg, ...messages];
        }
        return msg;
    },

    /**
     * Check all product variant gram group limit
     * @param {any} item
     * @param {Array} msg
     * @returns {Array}
     */
    isValidGroupProductVariantGram: function (item, msg) {
        const { filter } = item.group;

        const messages = this.data.variantData
            .map((it) => {
                let isLimitCheck = false;
                const grams = parseFloat(it.grams); // Ensure the grams value is numeric
                const filterGrams = parseFloat(filter); // Ensure the filter is numeric

                switch (item.group.op) {
                    case "e": // Equal
                        isLimitCheck = grams === filterGrams;
                        break;
                    case "ne": // Not equal
                        isLimitCheck = grams !== filterGrams;
                        break;
                    case "g": // Greater than
                        isLimitCheck = grams > filterGrams;
                        break;
                    case "l": // Less than
                        isLimitCheck = grams < filterGrams;
                        break;
                    default:
                        isLimitCheck = false;
                        break;
                }

                if (isLimitCheck) {
                    if (!(it.quantity >= item.min && it.quantity <= item.max) || (item?.multiple && it.quantity % item?.multiple !== 0)) {
                        return item.message;
                    }
                }
                return null;
            })
            .filter((it) => it); // Filter out null values

        if (messages.length > 0) {
            return [...msg, ...messages];
        }
        return msg;
    },

    /**
     * Check all product variant title group limit
     * @param {any} item
     * @param {Array} msg
     * @returns {Array}
     */
    isValidGroupProductVariantTitle: function (item, msg) {
        const { filter } = item.group;

        const filterArray = filter.split(",");

        const messages = this.data.variantData
            .map((it) => {
                let isLimitCheck = false;
                switch (item.group.op) {
                    case "e":
                        isLimitCheck = it.variant_title === filter;
                        break;
                    case "ne":
                        isLimitCheck = it.variant_title !== filter;
                        break;
                    case "oo":
                        isLimitCheck =
                            Array.isArray(filterArray) && filterArray.includes(it.variant_title);
                        break;
                    case "no":
                        isLimitCheck =
                            Array.isArray(filterArray) &&
                            !filterArray.includes(it.variant_title);
                        break;
                    default:
                        isLimitCheck = false;
                        break;
                }
                if (isLimitCheck) {
                    if (!(it.quantity >= item.min && it.quantity <= item.max) || (item?.multiple && it.quantity % item?.multiple !== 0)) {
                        return item.message;
                    }
                }
                return null;
            })
            .filter((it) => it); // Filter out null values

        if (messages.length > 0) {
            return [...msg, ...messages];
        }
        return msg;
    },

    /**
     * Check all product variant sku group limit
     * @param {any} item
     * @param {Array} msg
     * @returns {Array}
     */
    isValidGroupProductVariantSku: function (item, msg) {
        const { filter } = item.group;

        const filterArray = filter.split(",");

        const messages = this.data.variantData
            .map((it) => {
                let isLimitCheck = false;
                switch (item.group.op) {
                    case "e":
                        isLimitCheck = it.sku === filter;
                        break;
                    case "ne":
                        isLimitCheck = it.sku !== filter;
                        break;
                    case "oo":
                        isLimitCheck =
                            Array.isArray(filterArray) && filterArray.includes(it.sku);
                        break;
                    case "no":
                        isLimitCheck =
                            Array.isArray(filterArray) &&
                            !filterArray.includes(it.sku);
                        break;
                    default:
                        isLimitCheck = false;
                        break;
                }
                if (isLimitCheck) {
                    if (!(it.quantity >= item.min && it.quantity <= item.max) || (item?.multiple && it.quantity % item?.multiple !== 0)) {
                        return item.message;
                    }
                }
                return null;
            })
            .filter((it) => it); // Filter out null values

        if (messages.length > 0) {
            return [...msg, ...messages];
        }
        return msg;
    },

    /**
     * Check all product variant price group limit
     * @param {any} item
     * @param {Array} msg
     * @returns {Array}
     */
    isValidGroupProductVariantPrice: function (item, msg) {
        const { filter } = item.group;

        const messages = this.data.variantData
            .map((it) => {
                let isLimitCheck = false;
                const priceInCents = parseFloat(it.price); // Parse the price as a float
                const actualPrice = priceInCents / 100; // Convert price to actual value (e.g., 10000 to 100)
                const filterPrice = parseFloat(filter); // Parse the filter value

                switch (item.group.op) {
                    case "e": // Equal
                        isLimitCheck = actualPrice === filterPrice;
                        break;
                    case "ne": // Not equal
                        isLimitCheck = actualPrice !== filterPrice;
                        break;
                    case "g": // Greater than
                        isLimitCheck = actualPrice > filterPrice;
                        break;
                    case "l": // Less than
                        isLimitCheck = actualPrice < filterPrice;
                        break;
                    default:
                        isLimitCheck = false;
                        break;
                }

                if (isLimitCheck) {
                    if (!(it.quantity >= item.min && it.quantity <= item.max) || (item?.multiple && it.quantity % item?.multiple !== 0)) {
                        return item.message;
                    }
                }
                return null;
            })
            .filter((it) => it); // Filter out null values

        if (messages.length > 0) {
            return [...msg, ...messages];
        }
        return msg;
    },
    isEvaluateConditions: function (condition) {
        const cartData = this.data.cartData;

        if (condition.type === "subtotal") {
            return this.isEvaluateSubtotalCondition(
                condition.op,
                condition.filter,
                cartData.items_subtotal_price,
            );
        } else if (condition.type === "ctags") {
            return this.isEvaluateCustomerTagCondition(condition);
        } else if (
            condition.type === "cart-item-e" ||
            condition.type === "cart-item-ne"
        ) {
            let hasOk = this.isEvaluateCartItemCondition(condition?.filter);
            return condition.type === "cart-item-e" ? hasOk : !hasOk;
        } else if (condition.type === "time") {
            return this.isEvaluatePurchaseDateCondition(condition);
        }

        if (condition.type === "[]" || condition.type === "{}") {
            let allConditionsMet = true;
            let anyConditionMet = false;

            condition.cond.forEach((cond) => {
                let conditionMet = false;
                conditionMet = this.isEvaluateConditions(cond);
                if (condition.type === "[]") {
                    allConditionsMet = allConditionsMet && conditionMet;
                } else if (condition.type === "{}") {
                    anyConditionMet = anyConditionMet || conditionMet;
                }
            });

            if (condition.type === "[]") {
                if (condition.op === "and") {
                    return allConditionsMet;
                } else {
                    return !allConditionsMet;
                }
            } else if (condition.type === "{}") {
                if (condition.op === "and") {
                    return anyConditionMet;
                } else {
                    return !anyConditionMet;
                }
            }
        }
        return false;
    },

    /**
     * condition check for cart sub total
     * @param {any} condition
     * @returns {boolean}
     */
    isEvaluateSubtotalCondition: function (op, filter, sub_total) {
        const subtotal = parseFloat(sub_total);
        const threshold = parseFloat(filter) * 100;
        switch (op) {
            case "e":
                return subtotal === threshold;
            case "ne":
                return subtotal !== threshold;
            case "g":
                return subtotal > threshold;
            case "l":
                return subtotal < threshold;
            default:
                return false;
        }
    },

    /**
     * Check all condition for product
     * @param {any} condition
     * @returns {boolean}
     */
    isEvaluateCartHasProductCondition: function (condition) {

        const filterIds = condition?.filter?.map((item) => parseInt(item.id, 10));
        if (!filterIds) {
            return false;
        }

        switch (condition?.op) {
            case "e": // equal
                const product = this.data.productData.filter(
                    (it) => it.id == filterIds[0],
                );
                if (product.length > 0) {
                    return true;
                }
                return false;

            case "ne": // not equal
                const productNotEqual = this.data.productData.filter(
                    (it) => it.id != filterIds[0],
                );

                if (productNotEqual.length > 0) {
                    return true;
                }
                return false;

            case "oo": // is one of
                const isOneOfProduct = this.data.productData.filter((it) =>
                    filterIds.includes(it.id),
                );

                if (isOneOfProduct.length > 0) {
                    return true;
                }
                return false;

            case "no": // not one of
                const notOneOfProduct = this.data.productData.filter(
                    (it) => !filterIds.includes(it.id),
                );
                if (notOneOfProduct.length === 0) {
                    return true;
                }
                return false;

            default:
                return false;
        }
    },

    /**
     * Check all condition for Collection
     * @param {any} condition
     * @returns {boolean}
     */
    isEvaluateCartHasCollectionCondition: function (condition) {
        const filterIds = condition?.filter?.map((item) => parseInt(item.id, 10));

        switch (condition?.op) {
            case "e": // equal
                const collection = this.data.collectionData.filter(
                    (it) => it.id == filterIds[0],
                );
                if (collection.length > 0) {
                    return true;
                }
                return false;

            case "ne": // not equal
                const collectionNotEqual = this.data.collectionData.filter(
                    (it) => it.id != filterIds[0],
                );
                if (collectionNotEqual.length > 0) {
                    return true;
                }
                return false;

            case "oo": // is one of
                const isOneOfCollection = this.data.collectionData.filter(
                    (it) => filterIds.includes(it.id),
                );
                if (isOneOfCollection.length > 0) {
                    return true;
                }
                return false;

            case "no": // not one of
                const notOneOfCollection = this.data.collectionData.filter(
                    (it) => !filterIds.includes(it.id),
                );
                if (notOneOfCollection.length === 0) {
                    return true;
                }
                return false;

            default:
                return false;
        }
    },

    /**
     * Check all condition for product tag
     * @param {any} condition
     * @returns {boolean}
     */
    isEvaluateCartHasPTagsCondition: function (condition) {
        const aTags = condition?.filter;
        const arrTags = condition?.filter?.split(",");
        const pData = this.data.productData;
        let checkLimit = false;

        switch (condition?.op) {
            case "e":
                checkLimit = false;
                pData?.map((it) => {
                    if (
                        it?.tags &&
                        it?.tags?.length &&
                        it?.tags.includes(aTags)
                    ) {
                        checkLimit = true;
                    }
                });
                return checkLimit;

            case "ne":
                checkLimit = true;
                pData?.map((it) => {
                    if (
                        it?.tags &&
                        it?.tags?.length &&
                        it?.tags.includes(aTags)
                    ) {
                        checkLimit = false;
                    }
                });
                return checkLimit;

            case "oo":
                checkLimit = false;
                pData?.map((it) => {
                    if (it?.tags && it?.tags?.length) {
                        const hasTag = it?.tags.filter((pt) =>
                            arrTags.includes(pt),
                        );
                        if (hasTag.length) {
                            checkLimit = true;
                        }
                    }
                });
                return checkLimit;

            case "no":
                checkLimit = true;
                pData?.map((it) => {
                    if (it?.tags && it?.tags?.length) {
                        const hasTag = it?.tags.filter((pt) =>
                            arrTags.includes(pt),
                        );
                        if (hasTag.length) {
                            checkLimit = false;
                        }
                    }
                });
                return checkLimit;

            default:
                return false;
        }
    },

    /**
     * Check all condition for product title
     * @param {any} condition
     * @returns {boolean}
     */
    isEvaluateCartHasPTitleCondition: function (condition) {
        const aTitle = condition?.filter;
        const arrTitles = condition?.filter?.split(",");
        const pData = this.data.productData;
        let checkLimit = false;

        switch (condition?.op) {
            case "e":
                checkLimit = false;
                pData?.map((it) => {
                    if (it?.title && it?.title == aTitle) {
                        checkLimit = true;
                    }
                });
                return checkLimit;

            case "ne":
                checkLimit = true;
                pData?.map((it) => {
                    if (it?.title && it?.title == aTitle) {
                        checkLimit = false;
                    }
                });
                return checkLimit;

            case "oo":
                checkLimit = false;
                pData?.map((it) => {
                    if (it?.title && arrTitles.includes(it?.title)) {
                        checkLimit = true;
                    }
                });
                return checkLimit;

            case "no":
                checkLimit = true;
                pData?.map((it) => {
                    if (it?.title && arrTitles.includes(it?.title)) {
                        checkLimit = false;
                    }
                });
                return checkLimit;

            default:
                return false;
        }
    },

    /**
     * Check all condition for product type
     * @param {any} condition
     * @returns {boolean}
     */
    isEvaluateCartHasPTypeCondition: function (condition) {
        const aString = condition?.filter;
        const arrStrings = condition?.filter?.split(",");
        const pData = this.data.productData;
        let checkLimit = false;

        switch (condition?.op) {
            case "e":
                checkLimit = false;
                pData?.map((it) => {
                    if (it?.type && it?.type == aString) {
                        checkLimit = true;
                    }
                });
                return checkLimit;

            case "ne":
                checkLimit = true;
                pData?.map((it) => {
                    if (it?.type && it?.type == aString) {
                        checkLimit = false;
                    }
                });
                return checkLimit;

            case "oo":
                checkLimit = false;
                pData?.map((it) => {
                    if (it?.type && arrStrings.includes(it?.type)) {
                        checkLimit = true;
                    }
                });
                return checkLimit;

            case "no":
                checkLimit = true;
                pData?.map((it) => {
                    if (it?.type && arrStrings.includes(it?.type)) {
                        checkLimit = false;
                    }
                });
                return checkLimit;

            default:
                return false;
        }
    },

    /**
     * Check all condition for product handles
     * @param {any} condition
     * @returns {boolean}
     */
    isEvaluateCartHasPHandleCondition: function (condition) {
        const aString = condition?.filter;
        const arrStrings = condition?.filter?.split(",");
        const pData = this.data.productData;
        let checkLimit = false;

        switch (condition?.op) {
            case "e":
                checkLimit = false;
                pData?.map((it) => {
                    if (it?.handle && it?.handle == aString) {
                        checkLimit = true;
                    }
                });
                return checkLimit;

            case "ne":
                checkLimit = true;
                pData?.map((it) => {
                    if (it?.handle && it?.handle == aString) {
                        checkLimit = false;
                    }
                });
                return checkLimit;

            case "oo":
                checkLimit = false;
                pData?.map((it) => {
                    if (it?.handle && arrStrings.includes(it?.handle)) {
                        checkLimit = true;
                    }
                });
                return checkLimit;

            case "no":
                checkLimit = true;
                pData?.map((it) => {
                    if (it?.handle && arrStrings.includes(it?.handle)) {
                        checkLimit = false;
                    }
                });
                return checkLimit;

            default:
                return false;
        }
    },

    /**
     * Check all condition for product vendor
     * @param {any} condition
     * @returns {boolean}
     */
    isEvaluateCartHasPVendorCondition: function (condition) {
        const aString = condition?.filter;
        const arrStrings = condition?.filter?.split(",");
        const pData = this.data.productData;
        let checkLimit = false;

        switch (condition?.op) {
            case "e":
                checkLimit = false;
                pData?.map((it) => {
                    if (it?.vendor && it?.vendor == aString) {
                        checkLimit = true;
                    }
                });
                return checkLimit;

            case "ne":
                checkLimit = true;
                pData?.map((it) => {
                    if (it?.vendor && it?.vendor == aString) {
                        checkLimit = false;
                    }
                });
                return checkLimit;

            case "oo":
                checkLimit = false;
                pData?.map((it) => {
                    if (it?.vendor && arrStrings.includes(it?.vendor)) {
                        checkLimit = true;
                    }
                });
                return checkLimit;

            case "no":
                checkLimit = true;
                pData?.map((it) => {
                    if (it?.vendor && arrStrings.includes(it?.vendor)) {
                        checkLimit = false;
                    }
                });
                return checkLimit;

            default:
                return false;
        }
    },

    /**
     * Check all condition for variant title
     * @param {any} condition
     * @returns {boolean}
     */
    isEvaluateCartHasVTitleCondition: function (condition) {
        const aString = condition?.filter;
        const arrStrings = condition?.filter?.split(",");
        const vData = this.data.variantData;
        let checkLimit = false;

        switch (condition?.op) {
            case "e":
                checkLimit = false;
                vData?.map((it) => {
                    if (it?.title && it?.title == aString) {
                        checkLimit = true;
                    }
                });
                return checkLimit;

            case "ne":
                checkLimit = true;
                vData?.map((it) => {
                    if (it?.title && it?.title == aString) {
                        checkLimit = false;
                    }
                });
                return checkLimit;

            case "oo":
                checkLimit = false;
                vData?.map((it) => {
                    if (it?.title && arrStrings.includes(it?.title)) {
                        checkLimit = true;
                    }
                });
                return checkLimit;

            case "no":
                checkLimit = true;
                vData?.map((it) => {
                    if (it?.title && arrStrings.includes(it?.title)) {
                        checkLimit = false;
                    }
                });
                return checkLimit;

            default:
                return false;
        }
    },

    /**
     * Check all condition for product sku
     * @param {any} condition
     * @returns {boolean}
     */
    isEvaluateCartHasSkuCondition: function (condition) {
        const aString = condition?.filter;
        const arrStrings = condition?.filter?.split(",");
        const vData = this.data.variantData;
        let checkLimit = false;

        switch (condition?.op) {
            case "e":
                checkLimit = false;
                vData?.map((it) => {
                    if (it?.sku && it?.sku == aString) {
                        checkLimit = true;
                    }
                });
                return checkLimit;

            case "ne":
                checkLimit = true;
                vData?.map((it) => {
                    if (it?.sku && it?.sku == aString) {
                        checkLimit = false;
                    }
                });
                return checkLimit;

            case "oo":
                checkLimit = false;
                vData?.map((it) => {
                    if (it?.sku && arrStrings.includes(it?.sku)) {
                        checkLimit = true;
                    }
                });
                return checkLimit;

            case "no":
                checkLimit = true;
                vData?.map((it) => {
                    if (it?.sku && arrStrings.includes(it?.sku)) {
                        checkLimit = false;
                    }
                });
                return checkLimit;

            default:
                return false;
        }
    },

    /**
     * Check all condition for product weight
     * @param {any} condition
     * @returns {boolean}
     */
    isEvaluateCartHasWeightCondition: function (condition) {
        const aString = parseFloat(condition?.filter);
        const vData = this.data.variantData;
        let checkLimit = false;

        switch (condition?.op) {
            case "e":
                checkLimit = false;
                vData?.map((it) => {
                    let gra = parseFloat(it?.grams || 0);
                    if (gra == aString) {
                        checkLimit = true;
                    }
                });
                return checkLimit;

            case "ne":
                checkLimit = false;
                vData?.map((it) => {
                    let gra = parseFloat(it?.grams || 0);
                    if (gra != aString) {
                        checkLimit = true;
                    }
                });
                return checkLimit;

            case "g":
                checkLimit = false;
                vData?.map((it) => {
                    let gra = parseFloat(it?.grams || 0);
                    if (gra > aString) {
                        checkLimit = true;
                    }
                });
                return checkLimit;

            case "l":
                checkLimit = false;
                vData?.map((it) => {
                    let gra = parseFloat(it?.grams || 0);
                    if (gra < aString) {
                        checkLimit = true;
                    }
                });
                return checkLimit;

            default:
                return false;
        }
    },

    /**
     * Check all condition for cart items
     * @param {any} condition
     * @returns {boolean}
     */
    isEvaluateCartItemCondition: function (condition) {
        switch (condition.field) {
            case "product":
                return this.isEvaluateCartHasProductCondition(condition);

            case "coll":
                return this.isEvaluateCartHasCollectionCondition(condition);

            case "ptag":
                return this.isEvaluateCartHasPTagsCondition(condition);

            case "product_title":
                return this.isEvaluateCartHasPTitleCondition(condition);

            case "product_type":
                return this.isEvaluateCartHasPTypeCondition(condition);

            case "handle":
                return this.isEvaluateCartHasPHandleCondition(condition);

            case "vendor":
                return this.isEvaluateCartHasPVendorCondition(condition);

            case "variant_title":
                return this.isEvaluateCartHasVTitleCondition(condition);

            case "sku":
                return this.isEvaluateCartHasSkuCondition(condition);

            case "grams":
                return this.isEvaluateCartHasWeightCondition(condition);

            default:
                return false;
        }
    },

    /**
     * Check all condition for customer tags
     * @param {any} condition
     * @returns {boolean}
     */
    isEvaluateCustomerTagCondition: function (condition) {
        const customerData = this.data.customerData;
        const customerTags = customerData?.tags || [];

        const aString = condition?.filter;
        const arrStrings = condition?.filter?.split(",");
        let tagExists = false;

        switch (condition?.op) {
            case "e":
                tagExists = customerTags.includes(aString);
                break;
            case "ne":
                tagExists = !customerTags.includes(aString);
                break;
            case "oo":
                tagExists =
                    Array.isArray(arrStrings) &&
                    arrStrings.some((f) => customerTags.includes(f));
                break;
            case "no":
                tagExists =
                    Array.isArray(arrStrings) &&
                    !arrStrings.some((f) => customerTags.includes(f));
                break;
            default:
                tagExists = false;
        }

        // Return the evaluated result
        return tagExists;
    },

    /**
     * Convert to utc for purchase date condition
     */
    convertToUTC: function (dateStr) {
        const date = new Date(dateStr);
        return new Date(
            date.getTime() + date.getTimezoneOffset() * 60000,
        ).toISOString();
    },
    /**
     * Check purchase date condition
     * @param {any} condition
     * @returns {boolean}
     */
    isEvaluatePurchaseDateCondition: function (condition) {
        const cdate = condition?.filter;
        if (!cdate) {
            return false;
        }

        const utcDate1 = this.convertToUTC(new Date());
        const utcDate2 = this.convertToUTC(cdate);

        switch (condition?.op) {
            case "g":
                return utcDate1 > utcDate2;

            case "l":
                return utcDate1 < utcDate2;

            default:
                return false;
        }
    },
    getCurrProductLimitData: function () {
        const data = {
            template: this.config.template,
        };
        const current = this;

        const urlEncodedData = new URLSearchParams(data).toString();

        fetch("/a/rule-limit-proxy", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: urlEncodedData,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.text();
            })
            .then((res) => {
                const jsonString = res.replace(/&quot;/g, '"');
                const jsonData = JSON.parse(jsonString);
                // console.log("json data", jsonData);

                const aggregateData = (data) => {
                    const map = new Map();

                    data.forEach((item) => {
                        if (map.has(item.id)) {
                            const existingItem = map.get(item.id);
                            existingItem.quantity += item.quantity;
                        } else {
                            map.set(item.id, { ...item });
                        }
                    });

                    return Array.from(map.values());
                };

                const output = {
                    collectionData: aggregateData(jsonData.collectionData),
                    productData: aggregateData(jsonData.productData),
                    variantData: jsonData.variantData,
                    cartData: jsonData.cart,
                    customerData: jsonData.customerData,
                    rules: jsonData.rules,
                    designcode: jsonData.designcode,
                };
                current.data = output;
                current.popupdesign = output.designcode;
                current.addPopupStyle();
                current.setCurrProductLimit(output.rules);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    },
    getCurrentQuantity: function () {
        let qtyInput = null;

        for (const selector of this.config.quantitySelector) {
            const el = document.querySelector(selector);
            if (el && el.offsetParent !== null) {
                this.config.currQuantitySelector = el;
                qtyInput = el;
                break;
            }
        }

        if (qtyInput) {
            const quantity = parseInt(qtyInput.value);
            return isNaN(quantity) ? 1 : quantity;
        }

        return 1;
    },
    setCurrentQuantity: function (qty) {
        let qtyInput = null;
        window.oldQty = parseInt(qty, 10);

        for (const selector of this.config.quantitySelector) {
            const el = document.querySelector(selector);
            if (el && el.offsetParent !== null) {
                qtyInput = el;
                break;
            }
        }

        if (qtyInput) {
            qtyInput.value = qty;
        }
    },
    loadCartData: async function () {
        this.config.currCartData = await this.cartData();
    },
    prDispatchAddToCart: function () {
        const currObj = this;
        const addToCartButtons = document.querySelectorAll(this.config.addtocartBtn);
        const plusButtons = document.querySelectorAll(this.config.plusSelector);
        const minusButtons = document.querySelectorAll(this.config.minusSelector);
        const quantitySelector = document.querySelectorAll(this.config.quantitySelector);
        this.foundAddToCartButton = addToCartButtons;
        if (addToCartButtons.length > 0) {
            addToCartButtons.forEach((button) => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.prCheckProductPageLimit(true, false);
                });
            });
        }
        if (minusButtons.length > 0) {
            minusButtons.forEach((button) => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    currObj.prCheckOnQtyChange();
                })
            })
        }
        if (plusButtons.length > 0) {
            plusButtons.forEach((button) => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    currObj.prCheckOnQtyChange();
                })
            })
        }
    },
    getNewInputQty: function (qty, incrementQty = 0, isInitial = false, isMax = false, isMin = false) {
        qty = parseInt(qty, 10);
        incrementQty = parseInt(incrementQty, 10);
        let newQty = qty;
        if (isInitial && incrementQty && incrementQty != 0) {
            newQty = Math.ceil(qty / incrementQty) * incrementQty;
            if (isMax) {
                newQty = Math.floor(qty / incrementQty) * incrementQty;
            }
        } else if (window.oldQty < qty && incrementQty != 0 && incrementQty) {
            if (isMax) {
                newQty = Math.floor(qty / incrementQty) * incrementQty;
            } else {
                newQty = Math.ceil(qty / incrementQty) * incrementQty;
            }
        } else if (window.oldQty > qty && incrementQty != 0 && incrementQty) {
            if (isMin) {
                newQty = Math.ceil(qty / incrementQty) * incrementQty;
            } else {
                newQty = Math.floor(qty / incrementQty) * incrementQty;
            }
        } else {
            newQty = qty;
        }
        return parseInt(newQty, 10);
    },
    prSetMessages: function (msg) {
        let messageHtml = "";
        messageHtml += `<li>${msg}</li>`;
        if (!document.getElementById("mc-rule-popup")) {
            let popupHTML = `<div id="mc-rule-popup" class="mc-rule-popup">
                            <div class="mc-rule-popup-content">
                                <span class="mc-rule-close-btn" id="closeRuleLimitPopupBtn">&times;</span>
                                <ul class="mc-limit-msg">
                                    ${messageHtml}
                                </ul>
                            </div>
                        </div>`;

            document.body.insertAdjacentHTML("beforeend", popupHTML);
        } else {
            let messageDiv = document.querySelector(".mc-limit-msg");
            messageDiv.innerHTML = messageHtml;
        }
        const popup = document.getElementById("mc-rule-popup");
        const closePopupBtn = document.getElementById("closeRuleLimitPopupBtn");
        this.showAlert();
        if (closePopupBtn && popup) {
            closePopupBtn.addEventListener("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                popup.style.display = "none";
            });
        }
    },
    prCheckOnQtyChange: function (isInitial = false) {
        const checkVarId = document.querySelector("input[name='id']").value;
        let VariantRule = null;
        if (checkVarId) {
            VariantRule = this.config.currVariantLimitRules[parseInt(checkVarId, 10)] || null;
        }
        const item = VariantRule || this.config.currProductLimitRule;
        let checkQty = this.getCurrentQuantity();
        let msg = null;
        if (item) {
            let newQty = checkQty;
            let incrementQty = item?.multiple || 0;
            newQty = this.getNewInputQty(checkQty, incrementQty, isInitial, false, false);
            if (newQty < parseInt(item.min, 10)) {
                msg = item.message;
                newQty = this.getNewInputQty(parseInt(item.min, 10), incrementQty, isInitial, false, true);
            } else if (newQty > parseInt(item.max, 10)) {
                msg = item.message;
                newQty = this.getNewInputQty(parseInt(item.max, 10), incrementQty, isInitial, true, false);
            }
            this.setCurrentQuantity(newQty);
        }
        if (msg !== null && !isInitial) {
            this.prSetMessages(msg);
        }
    },
    prCheckProductPageLimit: function (isAddToCart = false, isInitial = false) {
        const variantId = document.querySelector("input[name='id']").value;
        const VariantRule = this.config.currVariantLimitRules[variantId];
        const item = VariantRule || this.config.currProductLimitRule;
        try {
            var cart = this.config.currCartData;
            const cartItem = cart.items.find(
                (it) => it.product_id === this.config.currProduct.id
            );
            const cartQuantity = cartItem ? cartItem.quantity : 0;
            const currentQuantity = cartQuantity + this.getCurrentQuantity();
            let msg = null;
            if (
                Object.keys(item).length &&
                !(currentQuantity >= item.min && currentQuantity <= item.max) ||
                (item?.multiple && currentQuantity % item.multiple !== 0)
            ) {
                msg = item.message;
            }

            if (msg !== null) {
                if (!isInitial) {
                    this.prSetMessages(msg);
                }
            } else {
                if (isAddToCart) {
                    this.prAddToCartAction();
                    setTimeout(() => {
                        this.loadCartData();
                    }, 500);
                }
            }
        } catch (error) {
            console.error("Network response was not ok", error);
        }
    },
    prAddToCartAction: function () {
        this.foundAddToCartButton.forEach((button) => {
            const form = button.closest('form');
            form.dispatchEvent(new Event('submit', {
                bubbles: true,
                cancelable: true
            }));
        });
    },
    setCurrProductLimit: function (ruleArray) {
        const current = this;
        ruleArray.some(function (it) {
            if (it?.type == "limit") {
                if (it?.applyTo == "product") {
                    return current.prCheckProduct(it);
                }
                if (it?.applyTo == "sku") {
                    return current.prCheckVariantSku(it);
                }
                if (it?.applyTo == "group") {
                    return current.prCheckGroup(it);
                }
            }

            if (it?.type == "condition") {
                const isCheckRequire = current.prIsEvaluateConditions(it.condition);
                if (isCheckRequire) {
                    return current.setCurrProductLimit(it.items);
                }
            }
        });
        this.prCheckOnQtyChange(true);
    },
    /**
     * Check product limit for eligibility
     */
    prCheckProduct: function (item) {
        this.config.currProductLimitRule = item;
        return true;
    },
    /**
     * Check product limit for eligibility
     */
    prCheckVariantSku: function (item) {
        const variants = this.config.currProduct.variants;
        var variantLimit = {};
        variants?.map((variant) => {
            variantLimit[variant.id] = item;
        });
        this.config.currVariantLimitRules = variantLimit;
        return true;
    },
    prCheckGroup: function (item) {
        if (item.group.field === "product") {
            let isValid = this.prIsValidGroupProduct(item);
            if (isValid) this.config.currProductLimitRule = item;
            return isValid;
        }
        else if (item.group.field === "product_title") {
            let isValid = this.prIsValidGroupProductTitle(item);
            if (isValid) this.config.currProductLimitRule = item;
            return isValid;
        }
        else if (item.group.field === "ptag") {
            let isValid = this.prIsValidGroupProductTag(item);
            if (isValid) this.config.currProductLimitRule = item;
            return isValid;
        }
        else if (item.group.field === "product_type") {
            let isValid = this.prIsValidGroupProductType(item);
            if (isValid) this.config.currProductLimitRule = item;
            return isValid;
        }
        else if (item.group.field === "handle") {
            let isValid = this.prIsValidGroupProductHandle(item);
            if (isValid) this.config.currProductLimitRule = item;
            return isValid;
        }
        else if (item.group.field === "vendor") {
            let isValid = this.prIsValidGroupProductVendor(item);
            if (isValid) this.config.currProductLimitRule = item;
            return isValid;
        }
        else if (item.group.field === "coll") {
            let isValid = this.prIsValidGroupCollection(item);
            if (isValid) this.config.currProductLimitRule = item;
            return isValid;
        }
        else if (item.group.field === "price") {
            let isValid = this.prIsValidGroupVariantPrice(item);
            if (isValid) this.config.currProductLimitRule = item;
            return isValid;
        }
        else if (item.group.field === "variant_title") {
            let isValid = this.prIsValidGroupProductVariantTitle(item);
            if (isValid) this.config.currProductLimitRule = item;
            return isValid;
        }
        else if (item.group.field === "sku") {
            let isValid = this.prIsValidGroupProductVariantSku(item);
            if (isValid) this.config.currProductLimitRule = item;
            return isValid;
        }
        else if (item.group.field === "grams") {
            let isValid = this.prIsValidGroupProductVariantGram(item);
            if (isValid) this.config.currProductLimitRule = item;
            return isValid;
        }
    },
    prIsValidGroupProduct: function (item) {
        const filterIds = item.group.filter.map((item) => parseInt(item.id, 10));
        const crp = this.config.currProduct;
        switch (item.group.op) {
            case 'e':
                if (filterIds.length && crp?.id == filterIds[0]) {
                    return true;
                }
                break;

            case 'ne':
                if (filterIds.length && crp?.id !== filterIds[0]) {
                    return true;
                }
                break;

            case 'oo':
                if (filterIds.length && crp?.id && filterIds.includes(crp?.id)) {
                    return true;
                }
                break;

            case 'no':
                if (filterIds.length && crp?.id && !filterIds.includes(crp?.id)) {
                    return true;
                }
                break;

            default:
                break;
        }
        return false;
    },
    prIsValidGroupProductTitle: function (item) {
        const filterName = item.group.filter;
        const crp = this.config.currProduct;
        const filterArray = filterName.split(",");
        switch (item.group.op) {
            case 'e':
                if (filterName.length && crp?.title === filterName) {
                    return true;
                }
                break;

            case 'ne':
                if (filterName.length && crp?.title !== filterName) {
                    return true;
                }
                break;

            case 'oo':
                if (Array.isArray(filterArray) && filterArray.includes(crp?.title)) {
                    return true;
                }
                break;

            case 'no':
                if (Array.isArray(filterArray) && !filterArray.includes(crp?.title)) {
                    return true;
                }
                break;

            default:
                break;
        }
        return false;
    },
    prIsValidGroupProductTag: function (item) {
        const pTag = item.group.filter;
        const productTags = this.config.currProduct.tags;
        const filterArray = pTag.split(",");

        switch (item.group.op) {
            case 'e':
                if (pTag.length && productTags.includes(pTag)) {
                    return true;
                }
                break;

            case 'ne':
                if (pTag.length && !productTags.includes(pTag)) {
                    return true;
                }
                break;
            case 'oo':
                if (Array.isArray(filterArray) && filterArray.some(tag => productTags.includes(tag))) {
                    return true;
                }
                break;
            case 'no':
                if (Array.isArray(filterArray) && !filterArray.some(tag => productTags.includes(tag))) {
                    return true;
                }
                break;
            default:
                break;
        }
        return false;
    },
    prIsValidGroupProductType: function (item) {
        const pType = item.group.filter;
        const crp = this.config.currProduct;
        const filterArray = pType.split(",");

        switch (item.group.op) {
            case 'e':
                if (pType.length && crp?.type === pType) {
                    return true;
                }
                break;

            case 'ne':
                if (pType.length && crp?.type !== pType) {
                    return true;
                }
                break;

            case 'oo':
                if (Array.isArray(filterArray) && filterArray.includes(crp?.type)) {
                    return true;
                }
                break;

            case 'no':
                if (Array.isArray(filterArray) && !filterArray.includes(crp?.type)) {
                    return true;
                }
                break;

            default:
                break;
        }
        return false;

    },
    prIsValidGroupProductHandle: function (item) {
        const handle = item.group.filter;
        const crp = this.config.currProduct;
        const filterArray = handle.split(",");

        switch (item.group.op) {
            case 'e':
                if (handle.length && crp?.handle === handle) {
                    return true;
                }
                break;

            case 'ne':
                if (handle.length && crp?.handle !== handle) {
                    return true;
                }
                break;

            case 'oo':
                if (Array.isArray(filterArray) && filterArray.includes(crp?.handle)) {
                    return true;
                }
                break;

            case 'no':
                if (Array.isArray(filterArray) && !filterArray.includes(crp?.handle)) {
                    return true;
                }
                break;

            default:
                break;
        }
        return false;
    },
    prIsValidGroupProductVendor: function (item) {
        const vendor = item.group.filter;
        const filterArray = vendor.split(",");
        const crp = this.config.currProduct;

        switch (item.group.op) {
            case 'e':
                if (vendor.length && crp?.vendor === vendor) {
                    return true;
                }
                break;

            case 'ne':
                if (vendor.length && crp?.vendor !== vendor) {
                    return true;
                }
                break;

            case 'oo':
                if (Array.isArray(filterArray) && filterArray.includes(crp?.vendor)) {
                    return true;
                }
                break;

            case 'no':
                if (Array.isArray(filterArray) && !filterArray.includes(crp?.vendor)) {
                    return true;
                }
                break;

            default:
                break;
        }
        return false;
    },
    prIsValidGroupCollection: function (item) {
        const filterIds = item.group.filter.map((item) => parseInt(item.id, 10));
        const crpColllections = this.config.currProduct.collection_id;

        switch (item.group.op) {
            case 'e':
                if (filterIds.length && crpColllections.includes(filterIds[0])) {
                    return true;
                }
                break;

            case 'ne':
                if (filterIds.length && !crpColllections.includes(filterIds[0])) {
                    return true;
                }
                break;

            case 'oo':
                if (filterIds.length && filterIds.some(id => crpColllections.includes(id))) {
                    return true;
                }
                break;

            case 'no':
                if (filterIds.length && filterIds.every(id => !crpColllections.includes(id))) {
                    return true;
                }
                break;

            default:
                break;
        }
        return false;
    },
    prIsValidGroupVariantPrice: function (item) {
        const variants = this.config.currProduct.variants;
        for (var i = 0; i < variants.length; i++) {
            switch (item.group.op) {
                case 'e':
                    if (parseFloat(variants[i].price) / 100 === parseFloat(item.group.filter)) {
                        this.config.currVariantLimitRules[variants[i].id] = item;
                    }
                    break;
                case 'ne':
                    if (parseFloat(variants[i].price) / 100 !== parseFloat(item.group.filter)) {
                        this.config.currVariantLimitRules[variants[i].id] = item;
                    }
                    break;
                case 'g':
                    if (parseFloat(variants[i].price) / 100 > parseFloat(item.group.filter)) {
                        this.config.currVariantLimitRules[variants[i].id] = item;
                    }
                    break;
                case 'l':
                    if (parseFloat(variants[i].price) / 100 < parseFloat(item.group.filter)) {
                        this.config.currVariantLimitRules[variants[i].id] = item;
                    }
                    break;

                default:
                    break;
            }
            if (this.config.currVariantLimitRules.length > 0) {
                return true;
            }
        }
        return false;
    },
    prIsValidGroupProductVariantTitle: function (item) {
        const filterVariantTitle = item.group.filter;
        const filterArray = filterVariantTitle.split(",");
        const variants = this.config.currProduct.variants;

        for (var i = 0; i < variants.length; i++) {
            switch (item.group.op) {
                case 'e':
                    if (filterVariantTitle.length && variants[i].title === filterVariantTitle) {
                        this.config.currVariantLimitRules[variants[i].id] = item;
                    }
                    break;
                case 'ne':
                    if (filterVariantTitle.length && variants[i].title !== filterVariantTitle) {
                        this.config.currVariantLimitRules[variants[i].id] = item;
                    }
                    break;
                case 'oo':
                    if (Array.isArray(filterArray) && filterArray.includes(variants[i].title)) {
                        this.config.currVariantLimitRules[variants[i].id] = item;
                    }
                    break;
                case 'no':
                    if (Array.isArray(filterArray) && !filterArray.includes(variants[i].title)) {
                        this.config.currVariantLimitRules[variants[i].id] = item;
                    }
                    break;

                default:
                    break;
            }
            if (this.config.currVariantLimitRules.length > 0) {
                return true;
            }
        }
        return false;
    },
    prIsValidGroupProductVariantSku: function (item) {
        const filterVariantSku = item.group.filter;
        const filterArray = filterVariantSku.split(",");
        const variants = this.config.currProduct.variants;
        for (var i = 0; i < variants.length; i++) {
            switch (item.group.op) {
                case 'e':
                    if (filterVariantSku.length && variants[i].sku == filterVariantSku) {
                        this.config.currVariantLimitRules[variants[i].id] = item;
                    }
                    break;
                case 'ne':
                    if (filterVariantSku.length && variants[i].sku !== filterVariantSku) {
                        this.config.currVariantLimitRules[variants[i].id] = item;
                    }
                    break;
                case 'oo':
                    if (Array.isArray(filterArray) && filterArray.includes(variants[i].sku)) {
                        this.config.currVariantLimitRules[variants[i].id] = item;
                    }
                    break;
                case 'no':
                    if (Array.isArray(filterArray) && !filterArray.includes(variants[i].sku)) {
                        this.config.currVariantLimitRules[variants[i].id] = item;
                    }
                    break;

                default:
                    break;
            }
            if (this.config.currVariantLimitRules.length > 0) {
                return true;
            }
        }
        return false;
    },
    prIsValidGroupProductVariantGram: function (item) {
        const filterVariantWeight = parseFloat(item.group.filter);
        const variants = this.config.currProduct.variants;

        for (var i = 0; i < variants.length; i++) {
            switch (item.group.op) {
                case 'e':
                    if (parseFloat(variants[i].weight) == filterVariantWeight) {
                        this.config.currVariantLimitRules[variants[i].id] = item;
                    }
                    break;
                case 'ne':
                    if (parseFloat(variants[i].weight) !== filterVariantWeight) {
                        this.config.currVariantLimitRules[variants[i].id] = item;
                    }
                    break;
                case 'g':
                    if (parseFloat(variants[i].weight) > filterVariantWeight) {
                        this.config.currVariantLimitRules[variants[i].id] = item;
                    }
                    break;
                case 'l':
                    if (parseFloat(variants[i].weight) < filterVariantWeight) {
                        this.config.currVariantLimitRules[variants[i].id] = item;
                    }
                    break;

                default:
                    break;
            }
            if (this.config.currVariantLimitRules.length > 0) {
                return true;
            }
        }
        return false;
    },
    prIsEvaluateConditions: function (condition) {
        if (condition.type === "ctags") {
            return this.prIsEvaluateCustomerTagCondition(condition);
        }
        else if (condition.type === "time") {
            return this.prIsEvaluatePurchaseDateCondition(condition);
        }

        if (condition.type === "[]" || condition.type === "{}") {
            let allConditionsMet = true;
            let anyConditionMet = false;

            condition.cond.forEach((cond) => {
                let conditionMet = false;
                conditionMet = this.prIsEvaluateConditions(cond);
                if (condition.type === "[]") {
                    allConditionsMet = allConditionsMet && conditionMet;
                } else if (condition.type === "{}") {
                    anyConditionMet = anyConditionMet || conditionMet;
                }
            });

            if (condition.type === "[]") {
                if (condition.op === "and") {
                    return allConditionsMet;
                } else {
                    return !allConditionsMet;
                }
            } else if (condition.type === "{}") {
                if (condition.op === "and") {
                    return anyConditionMet;
                } else {
                    return !anyConditionMet;
                }
            }
        }

        return false;
    },
    prIsEvaluateCustomerTagCondition: function (condition) {
        const customerData = this.data.customerData;
        const customerTags = customerData?.tags || [];
        const filterTag = condition?.filter;
        const filterArray = filterTag.split(",");

        switch (condition?.op) {
            case 'e':
                if (filterTag.length && customerTags.includes(filterTag)) {
                    return true;
                }
                break;

            case 'ne':
                if (filterTag.length && !customerTags.includes(filterTag)) {
                    return true;
                }
                break;

            case 'oo':
                if (Array.isArray(filterArray) && filterArray.some((f) => customerTags.includes(f))) {
                    return true;
                }
                break;

            case 'no':
                if (Array.isArray(filterArray) && !filterArray.some((f) => customerTags.includes(f))) {
                    return true;
                }
                break;

            default:
                break;
        }

        return false;
    },
    prIsEvaluatePurchaseDateCondition: function (condition) {
        const filterDate = condition?.filter;
        if (!filterDate) {
            return false;
        }
        const currentDate = this.convertToUTC(new Date());
        const actualFilterDate = this.convertToUTC(filterDate);

        switch (condition?.op) {
            case "g":
                if (currentDate > actualFilterDate) {
                    return true;
                }
                break;

            case "l":
                if (currentDate < actualFilterDate) {
                    return true;
                }
                break;

            default:
                return;
        }
        return false;
    },
    convertToUTC: function (dateStr) {
        const date = new Date(dateStr);
        return new Date(
            date.getTime() + date.getTimezoneOffset() * 60000,
        ).toISOString();
    },
    cartData: async function () {
        return fetch('/cart.js')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            });
    }
};