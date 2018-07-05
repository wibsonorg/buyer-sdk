pipeline {
  agent {
    dockerfile {
      filename 'Dockerfile'
    }

  }
  stages {
    stage('Buyer') {
      parallel {
        stage('Buyer API') {
          stage('Setup') {
            steps {
              sh 'npm install'
            }
          }
          stage('Status Checks') {
            parallel {
              stage('Test') {
                steps {
                  sh 'npm run test:coverage'
                }
              }
              stage('Linter') {
                steps {
                  sh 'npm run lint'
                }
              }
              stage('Audit') {
                steps {
                  sh 'npm audit'
                }
              }
            }
          }
          stage('Build') {
            steps {
              sh 'npm run build'
            }
          }
          stage('Publish') {
            steps {
              sh '''mkdir artifacts build
cp -r dist build/
cp -r config build/
cp -r node_modules build/
cp package.json build/
cd build
tar -zcf ../artifacts/wibson-api.tar.gz .'''
              archiveArtifacts(artifacts: 'artifacts/*.tar.gz', fingerprint: true, onlyIfSuccessful: true)
            }
          }
        }
      }
    }
  }
  environment {
    npm_config_cache = 'npm-cache'
  }
  post {
    failure {
      slackSend(color: 'danger', message: "Attention: The pipeline ${currentBuild.fullDisplayName} has failed.")

    }

    success {
      slackSend(color: 'good', message: "The pipeline ${currentBuild.fullDisplayName} completed successfully.")

    }

    always {
      publishHTML(allowMissing: true, alwaysLinkToLastBuild: false, keepAll: true, reportDir: 'coverage', reportFiles: 'index.html', reportTitles: 'Test Coverage Report', reportName: 'Test Coverage Report')

    }

  }
}
