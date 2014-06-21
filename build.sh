#!/bin/sh

#npm install yo
#npm install coffee-script
#npm install coffee-script-redux
#npm install karma
#npm install generator-angular
#npm install phantomjs
#sudo npm install -g PhantomJS
#npm install karma-phantomjs-launcher --save-dev

function load_env {
  [ -f ./vida_config/dev_env.sh ] && source ./vida_config/dev_env.sh
}

function build_local {
#    load_env
    play test
}

function build_and_push {
    git submodule update &&
    git pull --rebase && \
    build_local && \
    git push origin master
}

function deploy_heroku {
    build_local && \
    git push heroku master
}

function local_https_server {
    load_env
    JAVA_OPTS="-Dhttps.port=9001 -Xmx3g" play h2-browser run
}

function local_https_server_with_mysql {
    load_env
    JAVA_OPTS="-Dhttps.port=9001 -Xmx3g -Dconfig.resource=application_mysql.conf" play run
}

function deploy_prod {
    echo ".... start to deploy on env $1 ..."
    now=$(date +"%s")
    srcFilename="$(pwd)/target/universal/vida-1.0-SNAPSHOT.zip"
    destFilename="vida-1.0-SNAPSHOT.$now.zip"
    destServer="vida@$1"
    destPath="$destServer:~/$destFilename"
    play dist && \
    scp $srcFilename $destPath && \
    ssh $destServer "unzip -x $destFilename -d /var/play/$now/" && \
    ssh $destServer "rm /var/play/vida" && \
    ssh $destServer "ln -s /var/play/$now/vida-1.0-SNAPSHOT/ /var/play/vida" && \
    ssh $destServer "echo vvljiv8o | sudo -S service vida restart"

    retvalue=$?
    echo "Return value: $retvalue"
    echo "Done deployment $1"
}


function build_deploy_stage {
  build_and_push && deploy_prod 114.215.129.240
}

function js_dependency {
  grunt
}

function usage {
  echo Usage:
  echo ======================
  echo s for start local development server at 9000 port
  echo a for git pull/local build/git push/deploy to stage
  echo d for deploy to stage
  echo p for git pull/local build/git push
  echo b for local build
  echo js for update javascript dependency
  echo heroku for deploy to heroku
  echo none of the above will trigger local build only
  echo ======================
}

function main {
  	case $1 in
		js) js_dependency ;;
		s) local_https_server ;;
		mysql) local_https_server_with_mysql ;;
		a) build_deploy_stage ;;
		heroku) deploy_heroku ;;
		prod) deploy_prod 114.215.129.240 ;;
		d) deploy_prod 114.215.129.240 ;;
		p) build_and_push ;;
		b) build_local ;;
		h) usage ;;
		*) build_local ;;
	esac
}

main $@
