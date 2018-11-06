import { Value as JSONValue } from 'json-typescript';
import { Snapshottable, install as installSnapshot } from 'qunit-snapshot';
import { deprecate } from '@ember/application/deprecations';

function slug(raw: string) {
  return raw.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase();
}

declare global {
  interface Assert {
    snapshot(value: Snapshottable, name: string): void;
  }
}

const SNAPSHOTS: {
  [k: string]: SnapshotTest;
} = {};

interface SnapshotTest {
  [k: string]: JSONValue;
}
interface SnapshotFile {
  name: string;
  tests: SnapshotTest;
}
type AllSnapshots = SnapshotFile[];

/**
 * Setup snapshot testing
 *
 * @param qunit QUnit global
 * @public
 * @deprecated
 */
export function install(qunit: QUnit = QUnit) {
  // tslint:disable-next-line:no-console
  deprecate(
    'ember-qunit-snapshots - please use `setupSnapshots` instead of `install`',
    true,
    {
      id: 'ember-qunit-snapshots',
      until: 'v2.0.0'
    }
  );
  return setupSnapshots(qunit);
}

/**
 * Setup snapshot testing
 * @param qunit QUnit global
 * @public
 */
export function setupSnapshots(qunit: QUnit = QUnit) {
  return Promise.resolve().then(() =>
    installSnapshot(qunit, {
      loadSnapshots() {
        return fetch(`/___SNAPSHOTS___/snapshots`)
          .then(resp => resp.json())
          .then((data: AllSnapshots) => {
            data.forEach(fileData => {
              const { name, tests } = fileData;
              SNAPSHOTS[name] = tests;
            });
            return true;
          });
      },
      sanitize(type: 'element' | 'other', value: any) {
        if (type === 'element') {
          return value.replace(/\s+id="ember[0-9]+"/g, '');
        } else {
          return value;
        }
      },
      getSnapshot(moduleName: string, testName, snapName) {
        if (!SNAPSHOTS) return;
        const moduleSnapshots = SNAPSHOTS[slug(moduleName)];
        if (!moduleSnapshots) return;
        return moduleSnapshots[[testName, snapName].map(slug).join('-')];
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
            body: `{ "snapshot": ${serializedSnap} }`
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
