import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Slider } from 'primeng/slider';

@Component({
    selector: 'sliderNg',
    templateUrl: './slider.component.html',
    standalone: true,
    imports: [FormsModule, Slider]
})
export class SliderComponent {
    value!: number;
}