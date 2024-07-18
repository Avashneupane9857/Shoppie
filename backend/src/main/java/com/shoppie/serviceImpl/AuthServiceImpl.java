package com.shoppie.serviceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shoppie.model.User;
import com.shoppie.payload.SigninRequest;
import com.shoppie.payload.SignupRequest;
import com.shoppie.repo.UserRepo;
import com.shoppie.service.AuthService;

@Service
public class AuthServiceImpl implements AuthService{



    @Autowired
    private UserRepo userRepo;
    
    // @Autowired
    // private PasswordEncoder passwordEncoder;

    @Override
    public User register(SignupRequest req) {
        User user = new User();

        user.setUsername(req.getUsername());
        user.setName(req.getName());
        // user.setPassword(passwordEncoder.encode(req.getPassword(?)));
        user.setPassword(req.getPassword());
        return userRepo.save(user);
    }
    
    @Override
    public User authenticate(SigninRequest req) {
        User user = userRepo.findByUsername(req.getUsername());
        // if (user != null && passwordEncoder.matches(req.getPassword(), user.getPassword())) {
        if(user != null && req.getPassword().equals(user.getPassword())){
            return user;
        }
        throw new RuntimeException("Invalid credentials");
    }

}