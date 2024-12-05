(() => {
      
	actions.setDateAdded = {
		title: 'Set Date Added to Date Created',
		hotkeyAble: false,
		disabled: uitools.notMediaListSelected,
		visible: window.uitools.getCanEdit,
		execute: setDateAddedToDateCreated
	}
		
	window._menuItems.editTags.action.submenu.push({
		action: actions.setDateAdded,
		order: 60,
		grouporder: 10
	});
	
	async function setDateAddedToDateCreated() {

		let tracklist = uitools.getSelectedTracklist();
		await tracklist.whenLoaded();
	
		let message = sprintf("Are you sure you want to modify %d track%s?", tracklist.count, tracklist.count > 1 ? 's' : '');

		messageDlg(message, 'Confirmation', ['btnYes', 'btnNo'], { defaultButton: 'btnYes' }, function(result) {
			if (result.btnID === 'btnYes') {
				listAsyncForEach(tracklist, async (track, next) => {
					var jsonInfo = await app.filesystem.getFileInfoAsync(track.path)
					var info = JSON.parse(jsonInfo)
					track.dateAdded = app.utils.timestamp2DateTime(info.dateCreated)
					next();
				}, () => {
					tracklist.commitAsync()
					uitools.toastMessage.show(sprintf("Modified %s track%s.", tracklist.count, tracklist.count > 1 ? 's' : ''));
				});
			}
		});
	}	
})();
