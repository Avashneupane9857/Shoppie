pipeline {
    agent any
    environment {
        PATH = "/usr/local/bin:$PATH"
    }

    stages {
        stage('Build Docker Images') {
            steps {
                script {
                    
                    docker.build('avash9857/shoppie-frontendservice', './frontend')
                    
        
                    docker.build('avash9857/shoppie-appservice', './backend')
                }
            }
        }
        stage('Push to Docker Hub') {
            steps {
                script {
               withDockerRegistry([credentialsId: '10', url: 'https://index.docker.io/v1/']) {
        
                        docker.image('avash9857/shoppie-frontendservice').push('latest')
                        
                        
                        docker.image('avash9857/shoppie-appservice').push('latest')
                    }
                }
            }
        }
    }
}
