import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Dive } from './dive';
import { Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { NotifiactionsService } from './notifiactions.service';

@Injectable({
    providedIn: 'root'
})
export class DiveFileService {

    private _dives: Subject<Dive[]> = new Subject();
    private _uploadFinished: Subject<boolean> = new Subject();
    private diveList: Dive[] = [];

    constructor(private firestore: FirestoreService,
        private authService: AuthService,
        private functions: AngularFireFunctions,
        private notifications: NotifiactionsService) {

    }

    handleUddfFile(uddfFile: File) {
        const fileReader = new FileReader();
        fileReader.readAsText(uddfFile);

        fileReader.onload = () => {
            const callable = this.functions.httpsCallable('parseUddf');
            const func = callable({ uddf: fileReader.result });
            func.toPromise().then((dives: Dive[]) => {
                this.diveList = dives;
                this.diveList.forEach(val => {
                    val.details.startTime = new Date(val.details.startTime)
                })
                this._dives.next(this.diveList);
                this._uploadFinished.next(true);
                this.notifications.openSnackBar('Successfully processed file');
            })
        }
    }

    get dives() {
        return this._dives.asObservable();
    }

    get uploadFinished() {
        return this._uploadFinished.asObservable();
    }

    delete(index: number) {
        this.diveList.splice(index, 1);
        this._dives.next(this.diveList);
    }

    deleteAll() {
        this.diveList = [];
        this._dives.next(this.diveList);
    }

    persist() {
        return this.firestore.persistDives(this.authService.uid, this.diveList);
    }

}
