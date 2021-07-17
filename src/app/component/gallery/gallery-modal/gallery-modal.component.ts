import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
	selector: 'component-gallery-modal',
	templateUrl: 'gallery-modal.component.html',
	styleUrls: ['gallery-modal.component.scss']
})
export class GalleryModalComponent {

	@Input() data_gallery: any;

	constructor(public modalController: ModalController){ }

	dismiss(){
		this.modalController.dismiss();
	}

}
