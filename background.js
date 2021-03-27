var previousCpuInfo;
chrome.runtime.onMessageExternal.addListener(function (message, sender, callback) {
console.log(message);

if (message.openUrlInEditor){
    openUrl(message.openUrlInEditor);
}

function initCpu() {
    chrome.system.cpu.getInfo(function(cpuInfo) {
  
      var cpuName = cpuInfo.modelName.replace(/\(R\)/g, '®').replace(/\(TM\)/, '™');
      document.querySelector('#cpu-name').textContent = cpuName;
  
      var cpuArch = cpuInfo.archName.replace(/_/g, '-');
      document.querySelector('#cpu-arch').textContent = cpuArch;
  
      var cpuFeatures = cpuInfo.features.join(', ').toUpperCase().replace(/_/g, '.') || '-';
      document.querySelector('#cpu-features').textContent = cpuFeatures;
  
      document.querySelector('#cpu-temperatures').textContent = 'N/A';
      if ('temperatures' in cpuInfo) {
        updateCpuTemperatures(cpuInfo);
        document.querySelector('#cpu-temperatures').addEventListener('click', function(event) {
          chrome.storage.sync.get('cpuTemperatureScale', function(result) {
            var cpuTemperatureScale = result.cpuTemperatureScale || 'Celsius';
            chrome.storage.sync.set({cpuTemperatureScale: (cpuTemperatureScale === 'Fahrenheit') ? 'Celsius' : 'Fahrenheit'});
          });
        });
      }
  
      var cpuUsage = document.querySelector('#cpu-usage');
      var width = parseInt(window.getComputedStyle(cpuUsage).width.replace(/px/g, ''));
      for (var i = 0; i < cpuInfo.numOfProcessors; i++) {
        var bar = document.createElement('div');
        bar.classList.add('bar');
        var usedSection = document.createElement('span');
        usedSection.classList.add('bar-section', 'used');
        usedSection.style.transform = 'translate(-' + width + 'px, 0px)';
        bar.appendChild(usedSection);
        cpuUsage.appendChild(bar);
      }
    });
}