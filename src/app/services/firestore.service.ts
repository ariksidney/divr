import { Injectable } from '@angular/core';
import { AngularFirestore, Query } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { v1 as uuid } from 'uuid';
import { Dive, DiveSite } from './dive';
import { NotifiactionsService } from './notifiactions.service';
import { Filter } from '../components/dive-overview/filter/filter';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private angularFirestore: AngularFirestore,
    private notificationService: NotifiactionsService) { }

  getDives(userId: string, dives, pageSize: number, toNextPage: boolean, filter: Filter) {
    const baseQuery = this.angularFirestore.collection('/users').doc(userId)
      return baseQuery
        .collection('diveShort', ref => {
          let query : Query = ref;
          query = query.orderBy('startTime', 'desc')
          if (filter) {
            if (filter.country) { query = query.where('diveSite.country', '==', filter.country) }
            if (filter.fromDate) { query = query.where('startTime', '>=', filter.fromDate) }
            if (filter.toDate) { query = query.where('startTime', '<=', filter.toDate) }
          }
          if (!dives) {
            query = query.limit(pageSize)
          } else if (dives && toNextPage) {
            const lastDive = dives[dives.length - 1]
            query = query.startAfter(lastDive).limit(pageSize)
          } else if (dives && !toNextPage) {
            const firstDive = dives[0];
            query = query.endBefore(firstDive).limitToLast(pageSize)
          }
          return query;
        }).get();
  }

  getDetailedDive(userId: string, diveId: string) {
    return this.angularFirestore.collection('/users').doc(userId).collection('diveDetails').doc(diveId).get();
  }

  getStats(userId: string) {
    return this.angularFirestore.collection('/users').doc(userId).collection('meta').doc('stats').valueChanges();
  }

  persistDives(userId: string, dives: Dive[]) {
    const userIdRef = this.angularFirestore.collection('users').doc(userId).ref;
    const batch = this.angularFirestore.firestore.batch();
    dives.map(dive => {
      const diveId = uuid();
      const increment = firebase.firestore.FieldValue.increment(1);
      batch.set(userIdRef.collection('meta').doc('stats'), { 'diveCount': increment }, { merge: true });
      batch.set(userIdRef.collection('diveShort').doc(diveId), dive.details);
      batch.set(userIdRef.collection('diveDetails').doc(diveId), dive);
    });
    return batch.commit();
  }

  async updateDiveSite(userId: string, diveSite: DiveSite, diveId: string) {
    const userIdRef = this.angularFirestore.collection('users').doc(userId).ref;
    try {
      await this.angularFirestore.firestore.runTransaction(async t => {
        const diveShortRef = userIdRef.collection('diveShort').doc(diveId)
        const diveDetailsRef = userIdRef.collection('diveDetails').doc(diveId);
        t.update(diveDetailsRef, { 'details.diveSite': diveSite })
        t.update(diveShortRef, { 'diveSite': diveSite })
      })
      this.notificationService.openSnackBar('Successfully updated dive')
    } catch (err) {
      console.error(err);
      this.notificationService.openSnackBar('An error occured: ' + err);
    }
  }

  async deleteDive(userId: string, diveId: string) {
    const userIdRef = this.angularFirestore.collection('users').doc(userId).ref;
    const batch = this.angularFirestore.firestore.batch();
    const decrement = firebase.firestore.FieldValue.increment(-1);
    batch.set(userIdRef.collection('meta').doc('stats'), {'diveCount': decrement}, {merge: true});
    batch.delete(userIdRef.collection('diveShort').doc(diveId));
    batch.delete(userIdRef.collection('diveDetails').doc(diveId));
    try {
      await batch.commit();
      this.notificationService.openSnackBar('Successfully deleted dive')
    } catch (err) {
      console.error(err);
      this.notificationService.openSnackBar('An error occured: ' + err);
    }
  }

}

