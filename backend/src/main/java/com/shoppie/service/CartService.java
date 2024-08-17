package com.shoppie.service;

import java.util.List;

import com.shoppie.model.Cart;

public interface CartService {

    public Cart create(Cart cart);

    public List<Cart> getAll();

    public Cart getById(int cartId);

    public Cart getByUserId(int userId);

    public Cart clearByUserId(int userId);

    public void delete(int cartId);

    public Cart update(int userId, Cart cart);
    
}
