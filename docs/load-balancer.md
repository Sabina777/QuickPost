🧩 Step 2 – Load Balancer (NGINX)

To simulate horizontal scaling and traffic distribution in a monolithic app, we added an NGINX load balancer to distribute incoming HTTP requests to multiple backend instances running locally.

🔧 Goal

Implement a simple reverse proxy load balancer using NGINX to:

Simulate handling of high traffic

Distribute requests across multiple backend instances

Prepare for scalable architecture

📦 Backend Instance Setup

We modified the backend to use dynamic ports via environment variables:

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

Start three backend servers on different ports:

PORT=5000 node index.js
PORT=5001 node index.js
PORT=5002 node index.js

📥 Install NGINX on Windows

Download latest mainline NGINX for Windows:👉 https://nginx.org/en/download.html

Extract to C:\nginx

Start NGINX:

cd C:\nginx
start nginx

Visit http://localhost to verify it’s running.

⚙️ NGINX Configuration

Edit the file:C:\nginx\conf\nginx.conf

Replace the http block with:

http {
    upstream backend {
        server 127.0.0.1:5000;
        server 127.0.0.1:5001;
        server 127.0.0.1:5002;
    }

    server {
        listen 8080;

        location / {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
}

🔁 Reload or Restart NGINX

To apply changes:

nginx -s reload

If this doesn’t work, kill the NGINX process from Task Manager and re-run:

nginx.exe

✅ Testing

Now access your API via:

http://localhost:8080/api/posts

Each request will be routed to one of the running backend servers, simulating load balancing.