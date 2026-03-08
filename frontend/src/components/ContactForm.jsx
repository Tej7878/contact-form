import React, { useState } from "react";
import "./ContactForm.css";

function ContactForm() {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch("http://localhost:5000/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        const data = await res.text();
        alert(data);
    };

    return (
        <div className="container">

            <form className="contact-form flex flex-col gap-4" onSubmit={handleSubmit}>

                <div className="form-group">
                    <h2>Contact Us</h2>

                    <div className="form-group">
                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            onChange={handleChange}
                            required
                        />
                    </div>


                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Your Email"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <textarea
                            name="message"
                            placeholder="Your Message"
                            rows="4"
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <button type="submit">Send Message</button>

            </form>

        </div>
    );
}

export default ContactForm;