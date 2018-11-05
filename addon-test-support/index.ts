import { install as installSnapshot } from 'qunit-snapshot';

function slug(raw: string) {
  return raw.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase();
}

export function install(qunit: QUnit = QUnit) {
  return Promise.resolve().then(() =>
    installSnapshot(qunit, {
      loadSnapshots() {
        return fetch(`/___SNAPSHOTS___/snapshots`).then(() => true);
      },
      getSnapshot(moduleName, testName, snapName) {
        return null as any;
      },
      saveSnapshot(
        moduleName,
        testName,
        snapName,
        serializedSnap
      ): Promise<any> {
        return fetch(
          `/___SNAPSHOTS___/snapshot/${
            moduleName ? slug(moduleName) : 'no-module-name'
          }/${slug(testName)}/${slug(snapName)}`,
          {
            method: 'put',
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
              accept: 'application/json'
            },
            body: serializedSnap
          }
        )
          .then(resp => {
            if (!resp.ok) {
              return Promise.all(['error', resp.json()]);
            } else {
              return Promise.all(['ok', null]);
            }
          })
          .catch(err => {
            throw new Error(
              'Problem saving snapshot or decoding response\n' + err
            );
          })
          .then(([ok, data]) => {
            if (!ok) {
              throw new Error(
                'Problem creating snapshot\n' + JSON.stringify(data)
              );
            }
            return data;
          });
      }
    })
  );
}
