import React, { Component } from 'react';
import axios from 'axios';
import { Route, Switch } from 'react-router-dom';

import Product from '../../components/Product/Product';
import SelectedProduct from '../../components/SelectedProduct/SelectedProduct';
import SelectionButtons from '../../components/Navigation/Sidebar/SelectionButtons/SelectionButtons';
import './Store.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import Cart from '../../components/Cart/Cart';

class Store extends Component {
  state = {
    products: [],
    category: "all",
    allCategories: ["all"],
    searchValue: "",
    product: null,
    cart: []
  }

  componentDidMount() {
    axios.get('/products')
    .then(response => {
      // get unique values from array
      let uniqueCategories = ["all",...new Set(response.data.map(item => item.category))];
      this.setState({
        products: response.data,
        allCategories: uniqueCategories
      });
    })
  }

  searchValueHandler = (event) => {
    const newValue = event.target.value;
    this.setState({searchValue: newValue});
  }

  selectButtonHandler = (buttonId) => {
    this.setState({
      category: buttonId, 
      searchValue: ""});
  };

  selectProductHandler = (productId) => {
    this.setState({product: productId});
  }

  keyPressHandler = (event) => {
    if (event.key === 'Enter') {
      this.setState({
        category: "all",
        product: null
    });}
  }

  addToCartHandler = (id) => {
    //console.log("added to cart")
    //console.log(this.state.products[id-1]);
    const updatedCart = [...this.state.cart , this.state.products[id-1]]
    //console.log updatedCart);
    this.setState({cart: updatedCart})
  }

  render() { // If category "all" is selected, render all products, else render conditionally, based on selection
    let products = "";
    if (this.state.category === "all") {
      products = this.state.products.map(product => {
        if (product.name.toLowerCase().includes(this.state.searchValue.toLowerCase())) {
        return <Product 
        key={product.id}
        id={product.id}
        name={product.name}
        price={product.price}
        brand={product.brand}
        img={product.img}
        clicked={() => this.selectProductHandler(product.id)}  />
    } else return null;
  
  })} else {
      products = this.state.products.map(product => {
      if (product.category === this.state.category
      && product.name.toLowerCase().includes(this.state.searchValue.toLowerCase())
      ) {
        return <Product 
        key={product.id}
        id={product.id}
        name={product.name}
        price={product.price}
        brand={product.brand}
        img={product.img}
        clicked={() => this.selectProductHandler(product.id)} />
      } else {
        return null;
      }
    })};

    

    return (
      <div>
        <Cart cart={this.state.cart} />
        
        <Toolbar 
        changed={this.searchValueHandler} 
        search={this.keyPressHandler}
        />
        <div className="Sidebar">
          <SelectionButtons 
          categories={this.state.allCategories}
          selectButtonHandler={this.selectButtonHandler} />
        </div>
        <div className="MainArea">
          <Switch>
            <Route 
              path={"/" + this.state.product} 
              exact 
              render={(props) => <SelectedProduct {...props} add={() => this.addToCartHandler(this.state.product)} /> } />
            <Route 
              path='/' 
              component={() => <div>{products}</div>} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default Store;