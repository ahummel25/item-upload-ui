var appModule = angular.module('<%= name %>', [<%= includes.map(function (include) { return "'" + include + "'" }) %>, angularDragula(angular)]);
