<h1 align=center>Duxcore Core</h1>

This is the core of Duxcore, this is what houses the Duxcore API that handles task execution, manages the daemons, etc. This is a very intricate part of Duxcore, and so there is a bit to know about it.

## The Structure of the core

This application utilizes [Node.JS clusters](https://nodejs.org/api/cluster.html) and [Socket.IO](https://socket.io) to create a system where there is one master process, and you can create and add as many nodes as you want to the master process. These nodes can create and destroy API nodes and task executors.

### Master Process

The master process is the brain of Duxcore. It controls everything from the API nodes, to the daemons, to the task executors. This master process hosts a Socket.IO server, which the nodes connect to. In order for this to work, the nodes must be granted a secret. This secret will be used to ensure that the node is authorized to connect to the Duxcore network.

### Node Secrets

Node secrets are used to authenticate the nodes with the master process. These must be generated using the node creation tool. To use this tool, you can simply run the command below and you will be given a node secret that you can provide to your node process.

> **NOTE**: Before you run this command, you must have your development database running and placed in the `.env` file. or else this tool will not work.

```bash
$ yarn tool:createNode {NODE_NAME}
```

### Node Process

The node process is the muscle of Duxcore's core. The node process can control the api instances, and can execute tasks provided by the master node. The node process need three things to be able to connect to the master process:

- The Node ID defined in the `.env` file
- The Node Secret defined in the `.env` file
- The Master Socket URL defined in the `.env` file.

Once you have these three things, you can run your node process and it should simply connect to the master process and things should begin to happen automatically.

> **NOTE**: The master process must be running for the node processes to work

## Setting up your development enviornment

If you are looking to get involved on working with Duxcore's Core application, continue reading pas this point and we will go over how you can get the core up and running on your local machine.

### Installing and settting up dependencies

> If you are not alredy in the core directory, start by running this command
>
> ```bash
> cd core
> ```
>
> You need to run this command because all of the commands you are about to run are localized to the core directory.

Start by running the following command to get your node dependencies installed:

```bash
$ yarn install
```

### Starting the Database

Once you have installed all of the necessary modules, you will need to get your database server up and running as it is needed to generate Node secrets. To start up the database, open a new terminal and run the following command:

```bash
$ yarn db:dev
```

This will start an instance of [Postgresql](https://www.postgresql.org) within docker that can be edited in the `.docker/core/pgsql-docker-compose.yml` file.

### Setting up your `.env` file.

The .env file has many values that are critical to the functionality of the core application. To proceed beyond this point you must setup the .env file with the correct values. To see all of the values that you will need to fill in, you can look in the `.env.example` file which has all of the values that you will need to fill in the `.env` files. You can start by copying this file to a new file named `.env`:

```bash
cp .env.example .env
```

Now that you've coppied the example env file, you can now fill in the following values below:

- **`DASH_URL`**: `http://localhost:3000` - You can change this if you have already changed it, but by default, this is what is set to by default.
- **`MASTER_SERVER`**: `ws://localhost:49758` - You can change this if you need to, but it is advised that you do not change it.
- **`DATABSE_URL`**: `postgres://duxcore:123web123@localhost/duxcore` - This is simply the locally hosted version of the database. If you have started your database then this will be the address you will need to use.

### Setting up your private key files

In Duxcore there are two sets of keys that are essential to keeping the platform secure. To generate these keys you can simply run the following command and an automated script will define the keys for you.

```bash
yarn tool:generateKeys
```

### Running the master process

After you have started the database, you may now begin the process of setting up the core so that you can start it. We will start by getting an instance of the master started. The master process controls everything else, so it is the one thing you can run with little other setup.

To setup the master process, simply run the following command:

```bash
yarn master:dev
```

### Setting up a local Node Process

As mentioned earlier, the node processes are the processes that manage everything so they are very important. If you've already created your node, please place the **`NODE_ID`** and **`NODE_SECRET`** into the `.env` file, if you have not generated these things, please run the command above under the section on how to setup a node.

If you have your node Secret in place, then you need to run the command below and it will start a node process.

```bash
yarn dev
```

Now that you have your development enviornment setup, you can begin programming and contributing to the Duxcore Core application!
