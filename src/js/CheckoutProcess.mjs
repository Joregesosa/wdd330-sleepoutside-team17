import { getLocalStorage, qs } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

function formDataToJSON(formElement) {
    const formData = new FormData(formElement);
    const convertedJSON =  Object.fromEntries(formData.entries());
    return convertedJSON;
}

function packageItems(items) {
    const simplifiedItems = items.map((item) => {
        console.log(item);
        return {
            id: item.Id,
            price: item.FinalPrice,
            name: item.Name,
            quantity: 1,
        };
    });
    return simplifiedItems;
}

export default class CheckoutProcess {
    constructor(key, outputSelector) {
        this.key = key;
        this.outputSelector = outputSelector;
        this.list = [];
        this.itemTotal = 0;
        this.shipping = 0;
        this.tax = 0;
        this.orderTotal = 0;
    }

    init() {
        this.list = getLocalStorage(this.key);
        this.calculateItemSummary();
    }

    calculateItemSummary() {
 
        const summaryElement = qs( this.outputSelector + " #subtotal" );
        const itemsCount = qs( this.outputSelector + " #itemsCount" ); 
        itemsCount.innerText = this.list.length;
        this.itemTotal = this.list.reduce((sum, item) => sum + item.FinalPrice, 0);
        summaryElement.innerText = `$${this.itemTotal.toFixed(2)}`;
    }

    calculateOrderTotal() {
        this.tax = (this.itemTotal * .06);
        this.shipping = 10 + (this.list.length - 1) * 2;
        this.orderTotal = (
            parseFloat(this.itemTotal) +
            parseFloat(this.tax) +
            parseFloat(this.shipping)
        )
        this.displayOrderTotals();
    }

    displayOrderTotals() {
        const tax = qs(`${this.outputSelector} #tax`);
        const shipping = qs(`${this.outputSelector} #shipping`);
        const orderTotal = qs(`${this.outputSelector} #orderTotal`);
        tax.innerText = `$${this.tax.toFixed(2)}`;
        shipping.innerText = `$${this.shipping.toFixed(2)}`;
        orderTotal.innerText = `$${this.orderTotal.toFixed(2)}`;
    }
 
    async checkout(formElement) { 
        const order = formDataToJSON(formElement);
        order.orderDate = new Date().toISOString();
        order.orderTotal = this.orderTotal;
        order.tax = this.tax;
        order.shipping = this.shipping;
        order.items = packageItems(this.list);

        try {
            const response = await services.checkout(order);
            console.log(response);
        } catch (err) {
            console.log(err);
        }
    }
}