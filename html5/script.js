	var d = document;
	var db = openDatabase('myData','','My local DB', 2*1024*1024);
	init();
	//初始化本地数据库
	function init(){
		dataTable = d.getElementById("datatable");
		//导入数据到页面
		loadData();
		//添加数据
		d.getElementById("save").onclick = function(){
			saveData();
		}

		initCache()
	}


	function addData(name,msg,time){
		db.transaction(function(tx){
			tx.executeSql('insert into MsgData values(?,?,?)',[name,msg,time],function(tx, rs){
					console.log("成功保存数据");
				},function(tx, error){
					alert(error.source+ "::" + error.message);
				})
		})
	}

	function loadData(){
		db.transaction(function(tx){
			tx.executeSql('create table if not exists MsgData(name TEXT, msg TEXT, time INTEGER)',[]);
			tx.executeSql('select * from MsgData',[],function(tx,rs){
				removeShowData();
				for(var i=0; i<rs.rows.length; i++){
					showDataItem(rs.rows.item(i));
				}
			})
		});
	}
	
	function removeShowData(){
		for(var i = dataTable.childNodes.length - 1; i>=0; i--){
			datatable.removeChild(dataTable.childNodes[i])
		}
	}

	//显示第row条数据
	function showDataItem(row){
		var tr = d.createElement('tr'),
			tdName = d.createElement('td'),
			tdMsg = d.createElement('td'),
			tdDate = d.createElement('td');
			tdName.innerHTML = row.name;
			tdMsg.innerHTML = row.msg;
			tdDate.innerHTML = row.time;
			tr.appendChild(tdName);
			tr.appendChild(tdMsg);
			tr.appendChild(tdDate);
			dataTable.appendChild(tr);
	}

	function saveData(){
		addData(d.getElementById("name").value, d.getElementById("memo").value, new Date());
		loadData();
	}


	//init Offline application
	//发现具有manifest属性,   触发checking事件，
	//查找manifest文件，不存在触发errow事件，
	//请求文件过程中触发downloading事件，不间断触发 progress事件
	//下载结束触发cached事件，表缓存成功。
	//再次访问检查manifest是否更新过，无则触发noupdate事件，有则downloading事件，触发updateready事件。表示下载结束。
	// 最后可以通过swapCache方法来更新本地缓存。

	function initCache(){
		console.log(applicationCache);

		setInterval(function(){
			applicationCache.update();
		},5000);

		//监听应用程序是否已更新。
		applicationCache.addEventListener("updateready", function(){
			if(confirm("本地缓存已被更新,需要刷新画面来获取应用程序最新版本，是否刷新？")){
				applicationCache.swapCache();
				location.reload();
			}
		},true)
	}

	//tet