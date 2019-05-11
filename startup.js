const Koa = require('koa');
const req = require('request-promise');
const cors = require('koa2-cors');

const app = new Koa();

app.use(cors())

app.use(async (ctx, next) => {
	let { query } = ctx;
	let { url, zh_cn } = query;
	url = decodeURIComponent(url);
	url += '&query='+encodeURIComponent(zh_cn);
	console.log(999 + process.pid, zh_cn, url)
	let opt = {
		url,
		timeout: 15000
	}
	let res = await req(url).then(res => res, err => err);
	try {
		res = JSON.parse(res);
	} catch (err) {}
	ctx.body = res;
})

const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.warn(`主进程 ${process.pid} 正在运行`);

  // 衍生工作进程。
  for (let i = 0; i < numCPUs; i++) {
   const worker = cluster.fork();
    worker.on('exit', (code, signal) => {
	  if (signal) {
	    console.log(`worker was killed by signal: ${signal}`);
	  } else if (code !== 0) {
	    console.log(`worker exited with error code: ${code}`);
	  } else {
	    console.log('worker success!');
	  }
	});
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`工作进程 ${worker.process.pid} 已退出`);
  });
} else {
  // 工作进程可以共享任何 TCP 连接。
  // 在本例子中，共享的是 HTTP 服务器。
  app.listen(8900, () => {
		console.log('server open on http:localhost:8900')
	})

  console.log(`工作进程 ${process.pid} 已启动`);
}
