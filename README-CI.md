- CI Project Overview
  - (what are you doing, why, what tools)
    - Containerize an application with Docker by pulling the Docker Official image for HTTPD from Dockerhub. Next, I build a container from the image over the Docke      rfile I've created in the same directory as my website files.
- Run Project Locally
  - how to install docker + dependencies (WSL2, for example)
    - First, run this command to uninstall all conflicting packages: 

      `for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt-get remove $pkg; done`.

      - Next, the following code is entered in order to set up the repository:
 
			```# Add Docker's official GPG key:
 		   	   sudo apt-get update
		           sudo apt-get install ca-certificates curl gnupg
		           sudo install -m 0755 -d /etc/apt/keyrings
		           curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
		           sudo chmod a+r /etc/apt/keyrings/docker.gpg
			   # Add the repository to Apt sources:
		  	   echo \
  		  	   "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  		  	   "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  		  	   sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
		  	   sudo apt-get update
                	```

      - After that, in order to install the latest versions of Docker packages, run this command:

      		`sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin`

      - Finally, I verify that the Docker Engine installation is successful by running the hello-world image: 

        `sudo docker run hello-world`

        This last command downloads a test image and runs it in a container. 
        When the container runs, it prints a confirmation message and exits.         
      - how to build an image from the `Dockerfile`
        - One must create a Dockerfile in the project directory, the innards of which look like this: 

		```FROM httpd:2.4
                   COPY ./public-html/ /usr/local/apache2/htdocs/
		```
      
      - how to run the container
        - Build a container on the Dockerfile and run the container with the following commands: 

		`docker build -t my-apache2 .`

		`docker run -dit --name my-running-app -p 8080:80 my-apache2`
	
  - how to view the project running in the container (open a browser...go to IP and port...) 
    - One can simply type something like this into their browser: 

    `http://localhost:8080`

    and one should then see one's website displayed on one's monitor/screen.

## Part 2 - GitHub Actions and DockerHub

- Process to create public repo in DockerHub
	- First of all you need to have a Dockerhub account. Go to the repositories screen. Click the "Create Repository" button. 
	- After that, you simply configure the settings for the repository, such as: 
		- Namespace/Owner: Choose your DockerHub username or an organization you belong to.
		- Repository Name: Give your repository a (unique) name.
                - Visibility: Choose "Public" to make the repository public.
                - Repository Type: Choose "Image" for a regular Docker image repository. 
        - Next you can optionally add a description of your repo and you can optionally link your
          GitHub repo to automatically build Docker images whenever you push changes to your source code.
	- After dealing with those choices, click the "Create" button to create your repo. 
- How to authenticate with DockerHub via CLI using Dockerhub credentials
	- Use the docker login command. This command prompts you to enter your DockerHub username
	  and password to establish a secure connection to DockerHub: `docker login -u <your-username>`, e.g. `docker login -u jjh0k3`.
          You'll be prompted to enter your DockerHub password. Type your password and press Enter. 
        - That's all there is to it. If the login is successful, you'll see a message telling you so.  
- what credentials would you recommend providing? 
		- I would recommend using a PAT instead of a password. 
- How to push container image to Dockerhub (without GitHub Actions) 
	- Just open a terminal and login to Dockerhub with `docker login -u <your-username>`, e.g. `docker login -u jjh0k3`.
        - You will then be prompted to enter your DockerHub password. 
        - Before you push your local image to Dockerhub, you must tag the image with `docker tag <local-image-name> <your-username>/<repository-name>`. 
        - Once you have tagged the image, you can then push it on over to Dockerhub with `docker push <your-username>/<repository-name>`, 
          e.g.`docker push jjh0k3/f23-catsite:latest`.
        - Go to Dockerhub in a web browser, and make your way to the repo you pushed to. There you should see the pushed image.
- **Link** to your DockerHub repository 
	- [Dockerhub repo](https://hub.docker.com/repository/docker/jjh0k3/clockbox/general)
- Configuring GitHub Secrets
  - How to set a secret
  - What secret(s) are set for this project
    - Note: do not copy paste your secrets into your documentation
- Behavior of GitHub workflow
  - what does it do and when
  - what variables in workflow are custom to your project
    - think may need to be changed if someone else is going to use it or you reuse it



