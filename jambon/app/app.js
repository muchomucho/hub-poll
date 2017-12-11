import angular from 'angular';

var datas = {
	question: 'super question qui tue  ?',
	responses: [{txt: 'Reponse A', count: 50}, {txt: 'Reponse B', count: 25}]
}

HomeCtrl.$inject = ['$scope']
function HomeCtrl($scope) {
	$scope.form = {
		question: datas.question,
		resp1: datas.responses[0] && datas.responses[0].txt,
		resp2: datas.responses[1] && datas.responses[1].txt,
		success: '',
		error: ''
	}

	$scope.onSave = () => {
		if ($scope.form.question.length && $scope.form.resp1.length && $scope.form.resp2.length) {
			$scope.form.success = 'c dans la poche frero !'
			$scope.form.error = ''
		} else {
			$scope.form.error = 'Bah faut mettre un truc quand meme !'
			$scope.form.success = ''
		}
	}

	if (typeof Chart != 'undefined') {
		$scope.chartDataset = new Chart(document.getElementById('statChart').getContext("2d"), {
		    type: 'doughnut',
		    data: getChartData(),
		    options: {
            	responsive: true,
            	elements: {
                	arc: {
                    	borderColor: "#000000"
                	}
            	},
            	cutoutPercentage: 50
	        },
	        animation:{
	            animateScale: true
	        }
		});		
	}


	function getChartData() {
	    function randomColor(opacity) {
	        function randomColorFactor() {
	            return Math.round(Math.random() * 255);
	        }
	        return 'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' + randomColorFactor() + ',' + (opacity || '.3') + ')';
	    }
		var data = {
			datasets: [{
				data: [],
				backgroundColor: []
			}],
			labels: []
		}
		datas.responses.forEach(cur => {
			data.datasets[0].data.push(cur.count)
			data.labels.push(cur.txt)
			data.datasets[0].backgroundColor.push(randomColor(1))
		})
		console.log('data = ' + JSON.stringify(data))
		return data
	}
}

angular.module('app', [])
.controller('HomeCtrl', HomeCtrl)
.config(() => {

})
.run(() => {

})